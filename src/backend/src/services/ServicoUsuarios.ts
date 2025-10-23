import z from "zod";
import {
  InsertUsuarioSchemaZ,
  type UpdateUsuarioSchema,
} from "../db/schema/usuarios";
import { debug } from "../logging";
import { RepositorioUsuarios } from "../repository/RepositorioUsuarios";
import { hash } from "bcrypt";
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
    const listaLogins = await repositorioUsuarios.selecionarPorLogin(
      usuario.login,
    );
    if (listaLogins.length > 0) throw new ClientError("Login já existe.", 409);
    const insertUsuario = InsertUsuarioSchemaZ.parse({
      nome: usuario.nome,
      login: usuario.login,
      foto: usuario.foto,
      descricaco: usuario.descricao,
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
}

const servicoUsuarios = new ServicoUsuarios();

export default servicoUsuarios;
