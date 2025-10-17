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
    return await baseDados.transaction(async (tx) => {
      return await tx.all(this._query.getSQL());
    });
  }
}

// TODO: Verificar como retornar erros de funções async
export class RepositorioLotes {
  async inserir(lote: InsertLote) {
    return await baseDados.transaction(async (tx) => {
      return (await tx.insert(lotesTable).values(lote)).lastInsertRowid;
    });
  }

  async selecionarPorId(id: Uint8Array): Promise<SelectLote[]> {
    return await baseDados.transaction(async (tx) => {
      return await tx.select().from(lotesTable).where(eq(lotesTable.id, id));
    });
  }

  async selecionarTodos(): Promise<SelectLote[]> {
    return await baseDados.transaction(async (tx) => {
      return await tx.select().from(lotesTable);
    });
  }

  selecionarQuery() {
    const queryBase = new QueryBuilder().select().from(lotesTable).$dynamic();
    return new RepositorioLotesConsulta(queryBase);
  }

  async atualizarPorId(id: Uint8Array, lote: UpdateLote): Promise<number> {
    return await baseDados.transaction(async (tx) => {
      return (
        await tx.update(lotesTable).set(lote).where(eq(lotesTable.id, id))
      ).rowsAffected;
    });
  }

  async excluirPorId(id: Uint8Array) {
    return await baseDados.transaction(async (tx) => {
      return (await tx.delete(lotesTable).where(eq(lotesTable.id, id)))
        .rowsAffected;
    });
  }
}
