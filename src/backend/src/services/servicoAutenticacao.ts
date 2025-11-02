import z from "zod";
import { RepositorioUsuarios } from "../repository/repositorioUsuarios";
import { RepositorioSessoes } from "../repository/repositorioSessoes";
import { ClientError } from "../error";
import { compare } from "bcrypt";
import { error } from "../logging";
import type { SelectSessaoSchema } from "../db/schema/sessoes";

// O código utilizado neste arquivo foi adaptado de https://lucia-auth.com para fins de aprendizado.

const repositorioUsuarios = new RepositorioUsuarios();
const repositorioSessoes = new RepositorioSessoes();

export const CredenciaisSchemaZ = z.strictObject({
  login: z.string(),
  password: z.string(),
});

export type CredenciaisSchema = z.infer<typeof CredenciaisSchemaZ>;

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

const ONE_DAY = 60 * 60 * 24;
const SESSION_EXPIRES_IN_SECONDS = ONE_DAY;

// TODO: Check for timing attacks
export class AutenticacaoServico {
  async login(
    credenciais: CredenciaisSchema,
    userAgent: string,
    ipAddress: string,
  ): Promise<string> {
    const { login, password } = credenciais;
    // Verificar se existe um usuário com este login
    const usuario = await repositorioUsuarios.selecionarPorLogin(login);
    if (!usuario) {
      error("Nenhum usuário com o login informado foi encontrado.", {
        label: "Auth",
      });
      throw new ClientError("Unauthorized", 401);
    }
    const passwordCheck = await compare(password, usuario.hashedPassword);
    if (!passwordCheck) {
      error("A senha informada não confere.", { label: "Auth" });
      throw new ClientError("Unauthorized", 401);
    }
    const token = criarSessao(usuario.id, userAgent, ipAddress);
    return token;
  }

  async consultarSessao(sessionId: string): Promise<SelectSessaoSchema | null> {
    const now = new Date();

    const sessao = await repositorioSessoes.selecionarPorId(sessionId);
    if (!sessao) return null;

    // Check expiration
    if (
      now.getTime() - sessao.createdAt.getTime() >=
      SESSION_EXPIRES_IN_SECONDS * 1000
    ) {
      await repositorioSessoes.excluirPorId(sessionId);
      return null;
    }

    return sessao;
  }

  async consultarSessaoPorToken(
    token: string,
  ): Promise<SelectSessaoSchema | null> {
    const _token = parseToken(token);
    if (!_token) return null;
    return await this.consultarSessao(_token?.id);
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
}
