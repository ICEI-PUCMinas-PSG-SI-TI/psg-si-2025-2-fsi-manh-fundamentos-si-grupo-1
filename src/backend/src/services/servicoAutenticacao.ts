import z from "zod";
import { RepositorioUsuarios } from "../repository/repositorioUsuarios";
import { RepositorioSessoes } from "../repository/repositorioSessoes";
import { ClientError } from "../error";
import { compare } from "bcrypt";

const repositorioUsuarios = new RepositorioUsuarios();
const repositorioSessoes = new RepositorioSessoes();

export const CredenciaisSchemaZ = z.strictObject({
  login: z.string(),
  password: z.string(),
});

export type CredenciaisSchema = z.infer<typeof CredenciaisSchemaZ>;

// TODO
function generateToken(): string {
  return "tmp_token";
}

export class AutenticacaoServico {
  async login(
    credenciais: CredenciaisSchema,
    userAgent: string,
    ipAddress: string,
  ): Promise<string> {
    const { login, password } = credenciais;
    // Verificar se existe um usuário com este login
    const usuarios = await repositorioUsuarios.selecionarPorLogin(login);
    if (usuarios.length === 0 || !usuarios[0])
      throw new ClientError("Unauthorized", 401);
    const usuario = usuarios[0];
    const passwordCheck = await compare(password, usuario.hashedPassword);
    if (!passwordCheck) throw new ClientError("Unauthorized", 401);
    const token = generateToken();
    await repositorioSessoes.inserir({
      usuarioId: usuario.id,
      token: token,
      userAgent: userAgent,
      ip: ipAddress,
    });
    return token;
  }

  async logout(token: string): Promise<boolean> {
    const sessoes = await repositorioSessoes.selecionarPorToken(token);
    if (sessoes.length === 0 || !sessoes[0]) return false;
    // throw new ClientError("Not Found", 404);
    const excRes = await repositorioSessoes.excluirPorId(sessoes[0].id);
    return excRes > 0;
  }
}
