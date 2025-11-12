import "dotenv/config";
import { and, eq, type SQLWrapper } from "drizzle-orm";
import bancoDados from "../db";
import {
  tabelaTransacoes,
  type InsertTransacoesSchema,
  type SelectTransacoesSchema,
  type UpdateTransacoesSchema,
} from "../db/schema/transacoes";
import {
  QueryBuilder,
  type SQLiteSelectQueryBuilder,
} from "drizzle-orm/sqlite-core";
import type { SQL } from "bun";

class RespositorioTransacoesConsulta<T extends SQLiteSelectQueryBuilder> {
  _query: T;
  _whereAnd: SQLWrapper[];
  _whereOr: SQL[];

  constructor(queryBase: T) {
    this._query = queryBase;
    this._whereAnd = [];
    this._whereOr = [];
  }

  comPaginacao(pagina: number = 1, paginaTamanho: number = 10) {
    this._query = this._query
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
    return this;
  }

  comId(id: string) {
    this._whereAnd.push(eq(tabelaTransacoes.id, id));
    return this;
  }

  comProdutoId(id: string) {
    this._whereAnd.push(eq(tabelaTransacoes.produtoId, id));
    return this;
  }

  comUsuarioId(id: string) {
    this._whereAnd.push(eq(tabelaTransacoes.usuarioId, id));
    return this;
  }

  comLoteId(id: string) {
    this._whereAnd.push(eq(tabelaTransacoes.loteId, id));
    return this;
  }

  comDataMaiorQue(data: Date) {
    this._whereAnd.push(eq(tabelaTransacoes.horario, data));
    return this;
  }

  comDataMenorQue(data: Date) {
    this._whereAnd.push(eq(tabelaTransacoes.horario, data));
    return this;
  }

  executarConsulta(): Promise<SelectTransacoesSchema[]> {
    this._query.where(and(...this._whereAnd));
    return bancoDados.all(this._query.getSQL());
  }
}

export class RepositorioTransacoes {
  inserir(transacao: InsertTransacoesSchema) {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaTransacoes).values(transacao).returning({
        id: tabelaTransacoes.id,
      });
    });
  }

  selecionarPorId(id: string): Promise<SelectTransacoesSchema[]> {
    return bancoDados
      .select()
      .from(tabelaTransacoes)
      .where(eq(tabelaTransacoes.id, id));
  }

  selecionarTodos(): Promise<SelectTransacoesSchema[]> {
    return bancoDados.select().from(tabelaTransacoes);
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectTransacoesSchema[]> {
    return bancoDados
      .select()
      .from(tabelaTransacoes)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
  }

  selecionarQuery() {
    const queryBase = new QueryBuilder()
      .select()
      .from(tabelaTransacoes)
      .$dynamic();
    return new RespositorioTransacoesConsulta(queryBase);
  }

  atualizarPorId(id: string, sessao: UpdateTransacoesSchema): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaTransacoes)
        .set(sessao)
        .where(eq(tabelaTransacoes.id, id));
      return resultSet.rowsAffected;
    });
  }

  /* TODO: Verificar se será possível excluir transações
  async excluirPorId(id: string) {
    return await bancoDados.transaction(async (tx) => {
      // or .returning()
      return (await tx.delete(tabelaSessoes).where(eq(tabelaSessoes.id, id)))
        .rowsAffected;
    });
  }
  */
}
