import "dotenv/config";
import { and, eq, gte, like, lte } from "drizzle-orm";
import {
  lotesTable,
  type InsertLote,
  type SelectLote,
  type UpdateLote,
} from "../db/schema";
import baseDados from "../db";
import {
  QueryBuilder,
  type SQLiteSelectQueryBuilder,
} from "drizzle-orm/sqlite-core";
import { ClientError } from "../error";

class RepositorioLotesConsulta<T extends SQLiteSelectQueryBuilder> {
  _query: T;

  constructor(queryBase: T) {
    this._query = queryBase;
  }

  parseDate(date: Date | string) {
    throw new Error();
  }

  comPaginacao(page: number = 1, pageSize: number = 10) {
    this._query = this._query.limit(pageSize).offset((page - 1) * pageSize);
    return this;
  }

  // TODO: Verificar se as datas são validas
  comValidadeEntre(min: Date, max: Date) {
    if (min > max) throw new ClientError("comValidadeEntre: min > max");

    this._query = this._query.where(
      and(gte(lotesTable.validade, min), lte(lotesTable.validade, max))
    );
    return this;
  }

  comQuantidade(min: number, max: number) {
    if (min > max) throw new ClientError("comQuantidade: min > max");

    this._query = this._query.where(
      and(gte(lotesTable.quantidade, min), lte(lotesTable.quantidade, max))
    );
    return this;
  }

  comLote(lote: string) {
    this._query = this._query.where(like(lotesTable.lote, `%${lote}%`));
    return this;
  }

  async executarConsulta(): Promise<SelectLote[]> {
    return baseDados.transaction(async (tx) => {
      return tx.all(this._query.getSQL());
    });
  }
}

// TODO: Verificar como retornar erros de funções async
export class RepositorioLotes {
  async inserir(lote: InsertLote) {
    return baseDados.transaction(async (tx) => {
      return tx
        .insert(lotesTable)
        .values(lote)
        .then((result) => result.lastInsertRowid);
    });
  }

  async selecionarPorId(id: Uint8Array): Promise<SelectLote[]> {
    return baseDados.transaction(async (tx) => {
      return tx.select().from(lotesTable).where(eq(lotesTable.id, id));
    });
  }

  async selecionarTodos(): Promise<SelectLote[]> {
    return baseDados.transaction(async (tx) => {
      return tx.select().from(lotesTable);
    });
  }

  selecionarQuery() {
    let queryBase = new QueryBuilder().select().from(lotesTable).$dynamic();
    return new RepositorioLotesConsulta(queryBase);
  }

  async atualizarPorId(id: Uint8Array, lote: UpdateLote): Promise<number> {
    return baseDados.transaction(async (tx) => {
      return tx
        .update(lotesTable)
        .set(lote)
        .where(eq(lotesTable.id, id))
        .then((res) => res.rowsAffected);
    });
  }

  async excluirPorId(id: Uint8Array) {
    return baseDados.transaction(async (tx) => {
      return tx
        .delete(lotesTable)
        .where(eq(lotesTable.id, id))
        .then((result) => result.rowsAffected);
    });
  }
}
