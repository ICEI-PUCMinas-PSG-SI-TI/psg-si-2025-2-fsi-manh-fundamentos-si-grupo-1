import { and, count, eq, type SQLWrapper } from "drizzle-orm";
import bancoDados from "../db";
import { usuariosTable as tabelaUsuarios } from "../db/schema/usuarios";
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

  comPaginacao(page: number = 1, pageSize: number = 10) {
    this._query = this._query.limit(pageSize).offset((page - 1) * pageSize);
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

  async executarConsulta(): Promise<SelectUsuarioSchema[]> {
    this._query.where(and(...this._where));
    return await bancoDados.transaction(async (tx) => {
      return await tx.all(this._query.getSQL());
    });
  }
}

export class RepositorioUsuarios {
  async inserir(usuario: InsertUsuarioSchema) {
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

  async selecionarTodos(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<SelectUsuarioSchema[]> {
    return await bancoDados.transaction(async (tx) => {
      if (page >= 1 && pageSize >= 1) {
        return await tx
          .select()
          .from(tabelaUsuarios)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return await tx.select().from(tabelaUsuarios);
      }
    });
  }

  async selecionarPorLogin(login: string): Promise<SelectUsuarioSchema | null> {
    return await bancoDados.transaction(async (tx) => {
      const res = await tx
        .select()
        .from(tabelaUsuarios)
        .where(eq(tabelaUsuarios.login, login));
      if (res.length && res[0]) return res[0];
      return null;
    });
  }

  selecionarQuery() {
    const queryBase = new QueryBuilder()
      .select()
      .from(tabelaUsuarios)
      .$dynamic();
    return new RepositorioLotesConsulta(queryBase);
  }

  selecionarIdTodos(): Promise<{ id: string }[]> {
    return bancoDados.transaction((tx) => {
      return tx
        .select({
          id: tabelaUsuarios.id,
        })
        .from(tabelaUsuarios);
    });
  }

  async atualizarPorId(
    id: string,
    usuario: UpdateUsuarioSchema,
  ): Promise<number> {
    return await bancoDados.transaction(async (tx) => {
      return (
        await tx
          .update(tabelaUsuarios)
          .set(usuario)
          .where(eq(tabelaUsuarios.id, id))
      ).rowsAffected;
    });
  }

  async excluirPorId(id: string) {
    return await bancoDados.transaction(async (tx) => {
      // or .returning()
      return (await tx.delete(tabelaUsuarios).where(eq(tabelaUsuarios.id, id)))
        .rowsAffected;
    });
  }

  contar() {
    return bancoDados.select({ count: count() }).from(tabelaUsuarios);
  }
}
