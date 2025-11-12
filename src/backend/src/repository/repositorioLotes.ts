import "dotenv/config";
import { and, count, eq, gte, like, lte, type SQLWrapper } from "drizzle-orm";
import { tabelaLotes } from "../db/schema/lotes";
import bancoDados from "../db";
import {
  QueryBuilder,
  type SQLiteSelectQueryBuilder,
} from "drizzle-orm/sqlite-core";
import type {
  InsertLoteSchema,
  SelectLoteSchema,
  UpdateLoteSchema,
} from "../db/schema/lotes";

// TODO(!scope): Prevent calling where functions more than 1 time
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
    this._where.push(eq(tabelaLotes.id, id));
    return this;
  }

  comProdutoId(id: string) {
    this._where.push(eq(tabelaLotes.produtoId, id));
    return this;
  }

  comValidadeMaiorIgualQue(data: Date) {
    this._where.push(gte(tabelaLotes.validade, data));
    return this;
  }

  comValidadeMenorIgualQue(data: Date) {
    this._where.push(lte(tabelaLotes.validade, data));
    return this;
  }

  comQuantidadeMaiorIgualQue(valor: number) {
    this._where.push(gte(tabelaLotes.quantidade, valor));
    return this;
  }

  comQuantidadeMenorIgualQue(valor: number) {
    this._where.push(lte(tabelaLotes.quantidade, valor));
    return this;
  }

  comCodigo(lote: string) {
    this._where.push(like(tabelaLotes.codigo, `%${lote}%`));
    return this;
  }

  executarConsulta(): Promise<SelectLoteSchema[]> {
    this._query.where(and(...this._where));
    return bancoDados.all(this._query.getSQL());
  }
}

export class RepositorioLotes {
  inserir(lote: InsertLoteSchema) {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaLotes).values(lote).returning({
        id: tabelaLotes.id,
      });
    });
  }

  selecionarPorId(id: string): Promise<SelectLoteSchema[]> {
    return bancoDados.select().from(tabelaLotes).where(eq(tabelaLotes.id, id));
  }

  selecionarTodos(): Promise<SelectLoteSchema[]> {
    return bancoDados.select().from(tabelaLotes);
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectLoteSchema[]> {
    return bancoDados
      .select()
      .from(tabelaLotes)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
  }

  selecionarQuery() {
    const queryBase = new QueryBuilder().select().from(tabelaLotes).$dynamic();
    return new RepositorioLotesConsulta(queryBase);
  }

  selecionarIdProdutosTodos(): Promise<{ id: string; produtoId: string }[]> {
    return bancoDados
      .select({
        id: tabelaLotes.id,
        produtoId: tabelaLotes.produtoId,
      })
      .from(tabelaLotes);
  }

  async atualizarPorId(id: string, lote: UpdateLoteSchema): Promise<number> {
    return await bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaLotes)
        .set(lote)
        .where(eq(tabelaLotes.id, id));
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  async excluirPorId(id: string) {
    return await bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaLotes)
        .where(eq(tabelaLotes.id, id));
      return resultSet.rowsAffected;
    });
  }

  contar() {
    return bancoDados.select({ count: count() }).from(tabelaLotes);
  }
}
