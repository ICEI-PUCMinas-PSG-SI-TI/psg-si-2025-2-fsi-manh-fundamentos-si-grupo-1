import "dotenv/config";
import { and, eq, gte, like, lte, type SQLWrapper } from "drizzle-orm";
import { lotesTable } from "../db/schema";
import baseDados from "../db";
import { QueryBuilder, type SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import type { InsertLoteSchema, SelectLoteSchema, UpdateLoteSchema } from "../db/types";

// TODO: Prevent calling where functions more than 1 time
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
    this._where.push(eq(lotesTable.id, id));
    return this;
  }

  comProdutoId(id: string) {
    this._where.push(eq(lotesTable.produtoId, id));
    return this;
  }

  comValidadeMaiorIgualQue(data: Date) {
    this._where.push(gte(lotesTable.validade, data));
    return this;
  }

  comValidadeMenorIgualQue(data: Date) {
    this._where.push(lte(lotesTable.validade, data));
    return this;
  }

  comQuantidadeMaiorIgualQue(valor: number) {
    this._where.push(gte(lotesTable.quantidade, valor));
    return this;
  }

  comQuantidadeMenorIgualQue(valor: number) {
    this._where.push(lte(lotesTable.quantidade, valor));
    return this;
  }

  comLote(lote: string) {
    this._where.push(like(lotesTable.lote, `%${lote}%`));
    return this;
  }

  async executarConsulta(): Promise<SelectLoteSchema[]> {
    this._query.where(and(...this._where));
    return await baseDados.transaction(async (tx) => {
      return await tx.all(this._query.getSQL());
    });
  }
}

// TODO: Verificar como retornar erros de funções async
export class RepositorioLotes {
  async inserir(lote: InsertLoteSchema) {
    return await baseDados.transaction(async (tx) => {
      return (await tx.insert(lotesTable).values(lote)).lastInsertRowid;
    });
  }

  async selecionarPorId(id: string): Promise<SelectLoteSchema[]> {
    return await baseDados.transaction(async (tx) => {
      return await tx.select().from(lotesTable).where(eq(lotesTable.id, id));
    });
  }

  async selecionarTodos(page: number = 1, pageSize: number = 10): Promise<SelectLoteSchema[]> {
    return await baseDados.transaction(async (tx) => {
      if (page >= 1 && pageSize >= 1) {
        return await tx
          .select()
          .from(lotesTable)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return await tx.select().from(lotesTable);
      }
    });
  }

  selecionarQuery() {
    const queryBase = new QueryBuilder().select().from(lotesTable).$dynamic();
    return new RepositorioLotesConsulta(queryBase);
  }

  async atualizarPorId(id: string, lote: UpdateLoteSchema): Promise<number> {
    return await baseDados.transaction(async (tx) => {
      return (await tx.update(lotesTable).set(lote).where(eq(lotesTable.id, id))).rowsAffected;
    });
  }

  async excluirPorId(id: string) {
    return await baseDados.transaction(async (tx) => {
      return (await tx.delete(lotesTable).where(eq(lotesTable.id, id))).rowsAffected;
    });
  }
}
