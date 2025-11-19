import "dotenv/config";
import { and, eq, type SQL, type SQLWrapper } from "drizzle-orm";
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
import type { RefRegistro } from "./common";

class RespositorioTransacoesConsulta<T extends SQLiteSelectQueryBuilder> {
  _query: T;
  _whereAnd: SQLWrapper[];
  _whereOr: SQL[];

  constructor(queryBase: T) {
    this._query = queryBase;
    this._whereAnd = [];
    this._whereOr = [];
  }

  comPaginacao(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): RespositorioTransacoesConsulta<T> {
    this._query = this._query
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
    return this;
  }

  comId(id: string): RespositorioTransacoesConsulta<T> {
    this._whereAnd.push(eq(tabelaTransacoes.id, id));
    return this;
  }

  comProdutoId(id: string): RespositorioTransacoesConsulta<T> {
    this._whereAnd.push(eq(tabelaTransacoes.produtoId, id));
    return this;
  }

  comUsuarioId(id: string): RespositorioTransacoesConsulta<T> {
    this._whereAnd.push(eq(tabelaTransacoes.usuarioId, id));
    return this;
  }

  comLoteId(id: string): RespositorioTransacoesConsulta<T> {
    this._whereAnd.push(eq(tabelaTransacoes.loteId, id));
    return this;
  }

  comDataMaiorQue(data: Date): RespositorioTransacoesConsulta<T> {
    this._whereAnd.push(eq(tabelaTransacoes.horario, data));
    return this;
  }

  comDataMenorQue(data: Date): RespositorioTransacoesConsulta<T> {
    this._whereAnd.push(eq(tabelaTransacoes.horario, data));
    return this;
  }

  executarConsulta(): Promise<SelectTransacoesSchema[]> {
    this._query.where(and(...this._whereAnd));
    return bancoDados.all(this._query.getSQL());
  }
}

export class RepositorioTransacoes {
  inserir(...transacao: InsertTransacoesSchema[]): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaTransacoes).values(transacao).returning({
        id: tabelaTransacoes.id,
      });
    });
  }

  selecionarPorId(id: string): Promise<SelectTransacoesSchema | undefined> {
    return bancoDados
      .select()
      .from(tabelaTransacoes)
      .where(eq(tabelaTransacoes.id, id))
      .get();
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

  selecionarQuery(): RespositorioTransacoesConsulta<SQLiteSelectQueryBuilder> {
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

  // TODO: Verificar se será possível excluir transações
}

const repositorioMovimentacoes = new RepositorioTransacoes();

export default repositorioMovimentacoes;
