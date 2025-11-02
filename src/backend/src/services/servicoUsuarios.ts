import z from "zod";
import {
  InsertUsuarioSchemaZ,
  type UpdateUsuarioSchema,
} from "../db/schema/usuarios";
import { debug, error } from "../logging";
import { RepositorioUsuarios } from "../repository/repositorioUsuarios";
import { compare, hash } from "bcrypt";
import { ClientError } from "../error";

const repositorioUsuarios = new RepositorioUsuarios();

export const InsertUsuarioSchemaReqZ = InsertUsuarioSchemaZ.omit({
  hashedPassword: true,
  modoEscuro: true,
}).extend({
  // TODO: Quando criado o usuário terá uma senha padrão ou temporária?
  password: z.string().min(8).max(128),
});

type InsertUsuarioSchemaReq = z.infer<typeof InsertUsuarioSchemaReqZ>;

class ServicoUsuarios {
  async inserir(usuario: InsertUsuarioSchemaReq) {
    const rounds: number = parseInt(process.env.BCRYPT_ROUNDS!, 10);
    const hashedPassword: string = await hash(usuario.password, rounds);
    // Verifica se login já existe
    const _usuario = await repositorioUsuarios.selecionarPorLogin(
      usuario.login,
    );
    if (_usuario) throw new ClientError("Login já existe.", 409);
    const insertUsuario = InsertUsuarioSchemaZ.parse({
      nome: usuario.nome,
      login: usuario.login,
      foto: usuario.foto,
      descricao: usuario.descricao,
      habilitado: usuario.habilitado,
      nivelPermissoes: usuario.nivelPermissoes,
      hashedPassword: hashedPassword,
    });
    const res = await repositorioUsuarios.inserir(insertUsuario);
    if (res && res > 0) {
      debug(`Novo usuário criado!`, { label: "LoteService" });
    }
    return res;
  }

  async selecionarPorId(id: string) {
    const res = await repositorioUsuarios.selecionarPorId(id);
    debug(`Retornando usuário ${id}`, { label: "LoteService" });
    return res;
  }

  async selecionarTodos() {
    const res = await repositorioUsuarios.selecionarTodos();
    debug(`Retornando usuário`, { label: "LoteService" });
    return res;
  }

  async atualizar(id: string, usuario: UpdateUsuarioSchema) {
    const res = await repositorioUsuarios.atualizarPorId(id, usuario);
    debug(`Informações do usuário ${id} atualizadas!`, {
      label: "LoteService",
    });
    return res;
  }

  async excluirPorId(id: string) {
    const res = await repositorioUsuarios.excluirPorId(id);
    debug(`Informações do usuário ${id} excluidas!`, {
      label: "LoteService",
    });
    return res;
  }

  async contar() {
    const res = await repositorioUsuarios.contar();
    if (!res[0]) return 0;
    return res[0].count;
  }

  // TODO: Unificar validação de senha
  // async validarSenhaPorLogin(): Promise<boolean> {}
  // async validarSenhaPorLogin(): Promise<boolean> {}

  async alterarSenha(
    senhaAnterior: string,
    senhaNova: string,
    usuarioId: string,
  ): Promise<boolean> {
    // Verificar se a senha confere
    const usuario = await repositorioUsuarios.selecionarPorId(usuarioId);
    if (!usuario) {
      error("Nenhum usuário com o login informado foi encontrado.", {
        label: "Auth",
      });
      throw new ClientError("Unauthorized", 401);
    }
    const passwordCheck = await compare(senhaAnterior, usuario.hashedPassword);
    if (!passwordCheck) {
      error("A senha informada não confere.", { label: "Auth" });
      throw new ClientError("Unauthorized", 401);
    }
    // Realizar hash da nova senha
    const rounds: number = parseInt(process.env.BCRYPT_ROUNDS!, 10);
    const hashedPassword: string = await hash(senhaNova, rounds);
    // Atualizar a senha
    const updates = await repositorioUsuarios.atualizarPorId(usuarioId, {
      hashedPassword,
    });
    // TODO: Verificar necessidade de invalidar sessões
    return updates === 1;
  }
}

const servicoUsuarios = new ServicoUsuarios();

export default servicoUsuarios;
