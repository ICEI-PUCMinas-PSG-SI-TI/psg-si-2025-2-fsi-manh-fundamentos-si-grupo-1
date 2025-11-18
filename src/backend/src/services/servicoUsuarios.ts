import * as z4 from "zod/v4";
import {
  InsertUsuarioSchemaZ,
  type SelectUsuarioInfoSchema,
  type UpdateUsuarioSchema,
} from "../db/schema/usuarios";
import { debug, error } from "../logging";
import { RepositorioUsuarios } from "../repository/repositorioUsuarios";
import { compare, hash } from "bcrypt";
import { ClientError } from "../error";
import { PasswordZ, type UuidResult } from "../api/v1/objects";
import { Permissoes } from "../db/enums/permissoes";
import servicoPermissoes from "./servicoPermissoes";

const repositorioUsuarios = new RepositorioUsuarios();

export const InsertUsuarioSchemaReqZ = InsertUsuarioSchemaZ.omit({
  hashedPassword: true,
  modoEscuro: true,
}).extend({
  // TODO: Quando criado o usuário terá uma senha padrão ou temporária?
  password: PasswordZ,
});

export type InsertUsuarioSchemaReq = z4.infer<typeof InsertUsuarioSchemaReqZ>;

const bcryptRounds = process.env.BCRYPT_ROUNDS || "10";

export function hashSenha(senha: string): Promise<string> {
  const rounds: number = parseInt(bcryptRounds, 10);
  return hash(senha, rounds);
}

class ServicoUsuarios {
  async inserir(
    usuario: InsertUsuarioSchemaReq,
    opts?: {
      cargos?: Permissoes[];
    },
  ): Promise<UuidResult> {
    const hashedPassword = await hashSenha(usuario.password);
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
    if (res.length !== 1 || !res[0]) throw new ClientError("", 500);
    if (opts?.cargos) {
      await servicoPermissoes.adicionarPermissoesUsuario(
        res[0].id,
        ...opts.cargos,
      );
    }
    debug(`Novo usuário criado!`, { label: "UsuarioServ" });
    return res[0];
  }

  async listarUnicoPublico(
    id: string,
  ): Promise<SelectUsuarioInfoSchema | null> {
    const res = await repositorioUsuarios.selecionarPorId(id);
    if (!res) return null;
    return {
      id: res.id,
      nome: res.nome,
      descricao: res.descricao,
      foto: res.foto as string | null,
    };
  }

  /** Listar seleciona apenas as informações públicas */
  async listarTodosPerfil() {
    const res = await repositorioUsuarios.selecionarTodos();
    const usuarios = res.map((u) => ({
      id: u.id,
      nome: u.nome,
      login: u.login,
      descricao: u.descricao,
      habilitado: u.habilitado,
      modoEscuro: u.modoEscuro,
      foto: u.foto,
    }));
    return usuarios;
  }

  async selecionarPorId(id: string) {
    const res = await repositorioUsuarios.selecionarPorId(id);
    debug(`Retornando usuário ${id}`, { label: "UsuarioServ" });
    return res;
  }

  async selecionarTodos() {
    const usuarios = await repositorioUsuarios.selecionarTodos();
    debug(`Retornando usuário`, { label: "UsuarioServ" });
    return usuarios;
  }

  // NOTE: Utilizar com cuidado, atualmente utilizado apenas para faker.js
  selecionarIdTodos() {
    return repositorioUsuarios.selecionarIdsTodos();
  }

  async atualizar(id: string, usuario: UpdateUsuarioSchema) {
    const res = await repositorioUsuarios.atualizarPorId(id, usuario);
    debug(`Informações do usuário ${id} atualizadas!`, {
      label: "UsuarioServ",
    });
    return res;
  }

  async excluirPorId(id: string) {
    const res = await repositorioUsuarios.excluirPorId(id);
    debug(`Informações do usuário ${id} excluidas!`, {
      label: "UsuarioServ",
    });
    return res;
  }

  async contar() {
    const res = await repositorioUsuarios.contar();
    return res ? res.count : undefined;
  }

  // TODO: Unificar validação de senha
  // async validarSenhaPorLogin(): Promise<boolean> {}
  // async validarSenhaPorLogin(): Promise<boolean> {}

  async substituirSenha(usuarioId: string, senha: string) {
    // Realizar hash da nova senha
    const hashedPassword = await hashSenha(senha);
    // Atualizar a senha
    const updates = await repositorioUsuarios.atualizarPorId(usuarioId, {
      hashedPassword,
    });
    // TODO: Verificar necessidade de invalidar sessões
    return updates === 1;
  }

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
    return this.substituirSenha(usuarioId, senhaNova);
  }
}

const servicoUsuarios = new ServicoUsuarios();

export default servicoUsuarios;
