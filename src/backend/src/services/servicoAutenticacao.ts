import { Permissoes } from "../db/enums/permissoes";
import type { SelectSessaoSchema } from "../db/schema/sessoes";
import { ClientError } from "../error";
import { debug, error, warning } from "../logging";
import { RepositorioSessoes } from "../repository/repositorioSessoes";
import { RepositorioUsuarios } from "../repository/repositorioUsuarios";
import servicoPermissoes from "./servicoPermissoes";
import { compare } from "bcrypt";
import * as z4 from "zod/v4";

// O código utilizado neste arquivo foi adaptado de https://lucia-auth.com para fins de aprendizado.

const repositorioUsuarios = new RepositorioUsuarios();
const repositorioSessoes = new RepositorioSessoes();

export const CredenciaisSchemaZ = z4.strictObject({
  login: z4.string(),
  senha: z4.string(),
});

export type CredenciaisSchema = z4.infer<typeof CredenciaisSchemaZ>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserSessionInfoZ = z4.object({
  id: z4.string(),
  nome: z4.string(),
  login: z4.string(),
  modoEscuro: z4.boolean(),
  nivelPermissoes: z4.number(),
  foto: z4.base64(),
  permissoes: z4.array(z4.enum(Permissoes)),
});

export type UserSessionInfo = z4.infer<typeof UserSessionInfoZ>;

export function generateSecureRandomString(): string {
  // Human readable alphabet (a-z, 0-9)
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const alphabetLenght = alphabet.length;
  // Generate 24 bytes = 192 bits of entropy.
  // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  let id = "";
  for (let i = 0; i < bytes.length; i++) {
    id += alphabet[bytes[i]! % alphabetLenght];
  }
  return id;
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  let c = 0;
  for (let i = 0; i < a.byteLength; i++) {
    c |= a[i]! ^ b[i]!;
  }
  return c === 0;
}

export async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret);
  const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
  return new Uint8Array(secretHashBuffer);
}

async function criarSessao(
  userId: string,
  userAgent: string,
  ipAddress: string,
): Promise<string> {
  const id = generateSecureRandomString();
  const secret = generateSecureRandomString();
  const secretHash = await hashSecret(secret);
  const token = `${id}.${secret}`;
  debug(token, { label: "TokenGen" });
  await repositorioSessoes.inserir({
    id,
    secretHash: Buffer.from(secretHash),
    usuarioId: userId,
    userAgent,
    ipAddress,
  });
  return token;
}

type Token = {
  id: string;
  secret: string;
};

function parseToken(token: string): Token | null {
  const tokenParts = token.split(".");
  if (
    tokenParts.length !== 2 ||
    tokenParts[0]!.length === 0 ||
    tokenParts[1]!.length === 0
  ) {
    // TODO: Lançar excessão? Invalidar sessão?
    return null;
  }
  return {
    id: tokenParts[0]!,
    secret: tokenParts[1]!,
  };
}

const ONE_DAY = 60 * 60 * 24 * 1000;
const SESSION_EXPIRES_IN_MSECONDS = ONE_DAY;

// TODO: Check for timing attacks
export class ServicoAutenticacao {
  async login(
    login: string,
    senha: string,
    userAgent: string,
    ipAddress: string,
  ): Promise<{
    token: string;
    usuario: UserSessionInfo;
  }> {
    // Verificar se existe um usuário com este login
    const usuario = await repositorioUsuarios.selecionarPorLogin(login);
    if (!usuario) {
      error("Nenhum usuário com o login informado foi encontrado.", {
        label: "Auth",
      });
      throw new ClientError("Unauthorized", 401);
    }
    const passwordCheck = await compare(senha, usuario.hashedPassword);
    if (!passwordCheck) {
      error("A senha informada não confere.", { label: "Auth" });
      throw new ClientError("Unauthorized", 401);
    }
    const token = await criarSessao(usuario.id, userAgent, ipAddress);
    const perms = await servicoPermissoes.selecionarPermissoes(usuario.id);
    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        login: usuario.login,
        modoEscuro: usuario.modoEscuro,
        nivelPermissoes: usuario.nivelPermissoes,
        foto: usuario.foto as string,
        permissoes: perms,
      },
    };
  }

  // TODO: Unificar queries
  async consultarSessaoPorToken(
    token: string,
  ): Promise<UserSessionInfo | null> {
    const isValidSession = await servicoAutenticacao.validarSessao(token);
    if (!isValidSession) {
      warning("Sessão inválida", { label: "Session" });
      return null;
    }
    const _token = parseToken(token);
    if (!_token) return null;
    // TODO: validarSessao: Promise<SelectSessao>
    const sessao = await repositorioSessoes.selecionarPorId(_token?.id);
    if (!sessao) {
      error("Sessão não encontrada.", { label: "AuthServ" });
      return null;
    }
    const usuario = await repositorioUsuarios.selecionarPorId(sessao.usuarioId);
    if (!usuario) {
      error("Usuário não encontrado.", { label: "AuthServ" });
      return null;
    }
    const perms = await servicoPermissoes.selecionarPermissoes(usuario.id);
    return {
      id: usuario.id,
      nome: usuario.nome,
      login: usuario.login,
      modoEscuro: usuario.modoEscuro,
      nivelPermissoes: usuario.nivelPermissoes,
      foto: usuario.foto as string,
      permissoes: perms,
    };
  }

  async selecionarSessao(
    sessionId: string,
  ): Promise<SelectSessaoSchema | null> {
    const now = new Date();
    const sessao = await repositorioSessoes.selecionarPorId(sessionId);
    if (!sessao) return null;
    // Check expiration
    if (
      now.getTime() - sessao.createdAt.getTime() >=
      SESSION_EXPIRES_IN_MSECONDS
    ) {
      warning(`Sessão expirada: ${sessionId}`, { label: "AuthServ" });
      await repositorioSessoes.excluirPorId(sessionId);
      return null;
    }
    return sessao;
  }

  async selecionarSessaoPorToken(
    token: string,
  ): Promise<SelectSessaoSchema | null> {
    const _token = parseToken(token);
    if (!_token) return null;
    return await this.selecionarSessao(_token?.id);
  }

  // NOTE: Aqui, todas as conexões serão validadas via hash do segredo.
  // Isso pode ser lento e a segurança adicional não é necessária no escopo do projeto.
  // TODO: Adicionar validarSessaoInseguro()
  async validarSessao(token: string): Promise<boolean> {
    const _token = parseToken(token);
    if (!_token) return false;
    const sessao = await repositorioSessoes.selecionarPorId(_token.id);
    if (!sessao) return false;
    const tokenSecretHash = await hashSecret(_token.secret);
    // Node.js only
    // crypto.timingSafeEqual(tokenSecretHash, sessao.secretHash)
    const validSecret = constantTimeEqual(tokenSecretHash, sessao.secretHash);
    if (!validSecret) return false;
    return true;
  }

  // TODO: Verificar se o segredo confere?
  async logout(token: string): Promise<boolean> {
    const _token = parseToken(token);
    if (!_token) return false;
    const sessoes = await repositorioSessoes.selecionarPorId(_token.id);
    if (!sessoes) return false;
    const excRes = await repositorioSessoes.excluirPorId(_token.id);
    return excRes > 0;
  }

  async logoutAll(token: string): Promise<boolean> {
    const _token = parseToken(token);
    if (!_token) return false;
    const sessoes = await repositorioSessoes.selecionarPorId(_token.id);
    if (!sessoes) return false;
    const excRes = await repositorioSessoes.excluirPorUsuarioId(
      sessoes.usuarioId,
    );
    return excRes > 0;
  }

  async invalidarSessoes(): Promise<boolean> {
    const res = await repositorioSessoes.excluirTodos();
    return res > 0;
  }
}

const servicoAutenticacao = new ServicoAutenticacao();

export default servicoAutenticacao;
