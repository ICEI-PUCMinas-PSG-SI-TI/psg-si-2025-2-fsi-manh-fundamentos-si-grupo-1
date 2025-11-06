import "dotenv/config";
import {
  and,
  asc,
  count,
  eq,
  getTableColumns,
  gte,
  like,
  lte,
  or,
  sql,
  SQL,
  type SQLWrapper,
} from "drizzle-orm";
import baseDados from "../db";
import {
  QueryBuilder,
  type SQLiteSelectQueryBuilder,
} from "drizzle-orm/sqlite-core";
import {
  produtosTable,
  produtosTable as tabelaProdutos,
  type InsertProdutosSchema,
  type SelectProdutosSchema,
  type UpdateProdutosSchema,
} from "../db/schema/produtos";
import { lotesTable } from "../db/schema/lotes";

// TODO(!scope): Prevent calling where functions more than 1 time
class RepositorioProdutosConsulta<T extends SQLiteSelectQueryBuilder> {
  _query: T;
  _whereAnd: SQLWrapper[];
  _whereOr: SQL[];

  constructor(queryBase: T) {
    this._query = queryBase;
    this._whereAnd = [];
    this._whereOr = [];
  }

  comPaginacao(page: number = 1, pageSize: number = 10) {
    this._query = this._query.limit(pageSize).offset((page - 1) * pageSize);
    return this;
  }

  comId(id: string) {
    this._whereAnd.push(eq(tabelaProdutos.id, id));
    return this;
  }

  comPrecoCustoMaiorIgualQue(valor: number) {
    this._whereAnd.push(gte(tabelaProdutos.precoCusto, valor));
    return this;
  }

  comPrecoCustoMenorIgualQue(valor: number) {
    this._whereAnd.push(lte(tabelaProdutos.precoCusto, valor));
    return this;
  }

  comPrecoVendaMaiorIgualQue(valor: number) {
    this._whereAnd.push(gte(tabelaProdutos.precoVenda, valor));
    return this;
  }

  comPrecoVendaMenorIgualQue(valor: number) {
    this._whereAnd.push(lte(tabelaProdutos.precoVenda, valor));
    return this;
  }

  comPrecoPromocaoMaiorIgualQue(valor: number) {
    this._whereAnd.push(gte(tabelaProdutos.precoPromocao, valor));
    return this;
  }

  comPrecoPromocaoMenorIgualQue(valor: number) {
    this._whereAnd.push(lte(tabelaProdutos.precoPromocao, valor));
    return this;
  }

  comPesoMaiorIgualQue(valor: number) {
    this._whereAnd.push(gte(tabelaProdutos.peso, valor));
    return this;
  }

  comPesoMenorIgualQue(valor: number) {
    this._whereAnd.push(lte(tabelaProdutos.peso, valor));
    return this;
  }

  comTexto(texto: string) {
    const _texto = `%${texto}%`;
    this._whereOr.push(
      like(tabelaProdutos.sku, _texto),
      like(tabelaProdutos.codigoBarra, _texto),
      like(tabelaProdutos.descricao, _texto),
      // like(tabelaProdutos.categoria, _texto),
      like(tabelaProdutos.marca, _texto),
      like(tabelaProdutos.fornecedor, _texto),
      // like(tabelaProdutos.dimensoes, _texto),
      // like(tabelaProdutos.localizacao, _texto),
    );
    return this;
  }

  executarConsulta(): Promise<SelectProdutosSchema[]> {
    this._query.where(and(...this._whereAnd, or(...this._whereOr)));
    return baseDados.transaction((tx) => {
      return tx.all(this._query.getSQL());
    });
  }
}

class RepositorioProdutosLotesConsulta<
  T extends SQLiteSelectQueryBuilder,
> extends RepositorioProdutosConsulta<T> {
  _having: SQL[];

  constructor(queryBase: T) {
    super(queryBase);
    this._having = [];
  }

  comQuantidadeMaiorIgualQue(valor: number) {
    this._having.push(gte(sql`quantidade_total`, valor));
    return this;
  }

  comQuantidadeMenorIgualQue(valor: number) {
    this._having.push(lte(sql`quantidade_total`, valor));
    return this;
  }

  override executarConsulta(): Promise<SelectProdutosSchema[]> {
    this._query.where(and(...this._whereAnd, or(...this._whereOr)));
    this._query.having(and(...this._having));
    return baseDados.transaction((tx) => {
      return tx.all(this._query.getSQL());
    });
  }
}

export class RepositorioProdutos {
  inserir(produto: InsertProdutosSchema) {
    return baseDados.transaction((tx) => {
      return tx.insert(tabelaProdutos).values(produto).returning({
        id: tabelaProdutos.id,
      });
    });
  }

  selecionarPorId(id: string): Promise<SelectProdutosSchema[]> {
    return baseDados.transaction((tx) => {
      return tx.select().from(tabelaProdutos).where(eq(tabelaProdutos.id, id));
    });
  }

  selecionarTodos(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<SelectProdutosSchema[]> {
    return baseDados.transaction((tx) => {
      if (page >= 1 && pageSize >= 1) {
        return tx
          .select()
          .from(tabelaProdutos)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return tx.select().from(tabelaProdutos);
      }
    });
  }

  selecionarIdTodos(): Promise<{ id: string }[]> {
    return baseDados.transaction((tx) => {
      return tx
        .select({
          id: produtosTable.id,
        })
        .from(tabelaProdutos);
    });
  }

  selecionarQuery() {
    const queryBase = new QueryBuilder()
      .select()
      .from(tabelaProdutos)
      .$dynamic();
    return new RepositorioProdutosConsulta(queryBase);
  }

  selecionarQueryComLotes() {
    const queryBase = new QueryBuilder()
      .select({
        ...getTableColumns(tabelaProdutos),
        quantidade: sql<number>`sum(${lotesTable.quantidade})`.as(
          "quantidade_total",
        ),
      })
      .from(tabelaProdutos)
      .leftJoin(lotesTable, eq(produtosTable.id, lotesTable.produtoId))
      .groupBy(produtosTable.id)
      .orderBy(asc(produtosTable.id))
      .$dynamic();
    return new RepositorioProdutosLotesConsulta(queryBase);
  }

  atualizarPorId(id: string, produto: UpdateProdutosSchema): Promise<number> {
    return baseDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaProdutos)
        .set(produto)
        .where(eq(tabelaProdutos.id, id));
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  excluirPorId(id: string) {
    return baseDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaProdutos)
        .where(eq(tabelaProdutos.id, id));
      return resultSet.rowsAffected;
    });
  }

  contar() {
    return baseDados.select({ count: count() }).from(tabelaProdutos);
  }
}
