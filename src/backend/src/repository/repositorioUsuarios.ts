import { and, count, eq, type SQLWrapper } from "drizzle-orm";
import bancoDados from "../db";
import { tabelaUsuarios } from "../db/schema/usuarios";
import type {
  InsertUsuarioSchema,
  SelectUsuarioSchema,
  UpdateUsuarioSchema,
} from "../db/schema/usuarios";
import {
  QueryBuilder,
  type SQLiteSelectQueryBuilder,
} from "drizzle-orm/sqlite-core";

class RepositorioLotesConsulta<T extends SQLiteSelectQueryBuilder> {
  _query: T;
  _where: SQLWrapper[];

  constructor(queryBase: T) {
    this._query = queryBase;
    this._where = [];
  }

  comPaginacao(pagina: number = 1, paginaTamanho: number = 10) {
    this._query = this._query
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
    return this;
  }

  comId(id: string) {
    this._where.push(eq(tabelaUsuarios.id, id));
    return this;
  }

  comLogin(login: string) {
    this._where.push(eq(tabelaUsuarios.login, login));
    return this;
  }

  executarConsulta(): Promise<SelectUsuarioSchema[]> {
    this._query.where(and(...this._where));
    return bancoDados.all(this._query.getSQL());
  }
}

export class RepositorioUsuarios {
  async inserir(...usuario: InsertUsuarioSchema[]) {
    return await bancoDados.transaction((tx) => {
      return tx.insert(tabelaUsuarios).values(usuario).returning({
        id: tabelaUsuarios.id,
      });
    });
  }

  selecionarPorId(id: string): Promise<SelectUsuarioSchema | null> {
    return bancoDados.transaction(async (tx) => {
      const res = await tx
        .select()
        .from(tabelaUsuarios)
        .where(eq(tabelaUsuarios.id, id));
      if (res.length && res[0]) return res[0];
      return null;
    });
  }

  selecionarTodos(): Promise<SelectUsuarioSchema[]> {
    return bancoDados.select().from(tabelaUsuarios);
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectUsuarioSchema[]> {
    return bancoDados
      .select()
      .from(tabelaUsuarios)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
  }

  async selecionarPorLogin(login: string): Promise<SelectUsuarioSchema | null> {
    const res = await bancoDados
      .select()
      .from(tabelaUsuarios)
      .where(eq(tabelaUsuarios.login, login));
    if (res.length && res[0]) return res[0];
    return null;
  }

  selecionarQuery() {
    const queryBase = new QueryBuilder()
      .select()
      .from(tabelaUsuarios)
      .$dynamic();
    return new RepositorioLotesConsulta(queryBase);
  }

  selecionarIdsTodos(): Promise<{ id: string }[]> {
    return bancoDados
      .select({
        id: tabelaUsuarios.id,
      })
      .from(tabelaUsuarios);
  }

  async atualizarPorId(
    id: string,
    usuario: UpdateUsuarioSchema,
  ): Promise<number> {
    return await bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaUsuarios)
        .set(usuario)
        .where(eq(tabelaUsuarios.id, id));
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  excluirPorId(id: string) {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaUsuarios)
        .where(eq(tabelaUsuarios.id, id));
      return resultSet.rowsAffected;
    });
  }

  contar() {
    return bancoDados.select({ count: count() }).from(tabelaUsuarios);
  }
}

const repositorioUsuarios = new RepositorioUsuarios();

export default repositorioUsuarios;
