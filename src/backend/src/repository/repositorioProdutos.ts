import bancoDados from "../db";
import { tabelaLotes } from "../db/schema/lotes";
import {
  type InsertProdutosSchema,
  type SelectProdutosSchema,
  type UpdateProdutosSchema,
  tabelaProdutos,
} from "../db/schema/produtos";
import type { Count, RefRegistro } from "./common";
import type { ResultSet } from "@libsql/client";
import "dotenv/config";
import {
  type ExtractTablesWithRelations,
  SQL,
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
} from "drizzle-orm";
import type { SQLiteTransaction } from "drizzle-orm/sqlite-core";

export type RepoConsultaParamsProduto = {
  pagina?: number;
  paginaTamanho?: number;
  comId?: string;
  comPrecoCustoMaiorIgualQue?: number;
  comPrecoCustoMenorIgualQue?: number;
  comPrecoVendaMaiorIgualQue?: number;
  comPrecoVendaMenorIgualQue?: number;
  comPrecoPromocaoMaiorIgualQue?: number;
  comPrecoPromocaoMenorIgualQue?: number;
  comPesoMaiorIgualQue?: number;
  comPesoMenorIgualQue?: number;
  comCategoria?: string;
  comTexto?: string;
};

export type RepoConsultaParamsProdutoQuantidade = RepoConsultaParamsProduto & {
  comQuantidadeMenorIgualQue?: number;
  comQuantidadeMaiorIgualQue?: number;
};

export class RepositorioProdutos {
  inserir(...produto: InsertProdutosSchema[]): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaProdutos).values(produto).returning({
        id: tabelaProdutos.id,
      });
    });
  }

  selecionarPorId(id: string): Promise<SelectProdutosSchema | undefined> {
    return bancoDados
      .select()
      .from(tabelaProdutos)
      .where(eq(tabelaProdutos.id, id))
      .get();
  }

  selecionarTodos(): Promise<SelectProdutosSchema[]> {
    return bancoDados.select().from(tabelaProdutos);
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectProdutosSchema[]> {
    return bancoDados
      .select()
      .from(tabelaProdutos)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
  }

  selecionarIdsTodos(): Promise<{ id: string }[]> {
    return bancoDados
      .select({
        id: tabelaProdutos.id,
      })
      .from(tabelaProdutos);
  }

  selecionarConsulta(
    opts?: RepoConsultaParamsProduto,
  ): Promise<SelectProdutosSchema[]> {
    const comId = (id: string): SQL => eq(tabelaProdutos.id, id);
    const comPrecoCustoMaiorIgualQue = (valor: number): SQL =>
      gte(tabelaProdutos.precoCusto, valor);
    const comPrecoCustoMenorIgualQue = (valor: number): SQL =>
      lte(tabelaProdutos.precoCusto, valor);
    const comPrecoVendaMaiorIgualQue = (valor: number): SQL =>
      gte(tabelaProdutos.precoVenda, valor);
    const comPrecoVendaMenorIgualQue = (valor: number): SQL =>
      lte(tabelaProdutos.precoVenda, valor);
    const comPrecoPromocaoMaiorIgualQue = (valor: number): SQL =>
      gte(tabelaProdutos.precoPromocao, valor);
    const comPrecoPromocaoMenorIgualQue = (valor: number): SQL =>
      lte(tabelaProdutos.precoPromocao, valor);
    const comPesoMaiorIgualQue = (valor: number): SQL =>
      gte(tabelaProdutos.peso, valor);
    const comPesoMenorIgualQue = (valor: number): SQL =>
      lte(tabelaProdutos.peso, valor);
    const comCategoria = (categoria: string): SQL =>
      eq(tabelaProdutos.categoria, categoria);
    const comTexto = (texto: string): SQL => {
      const _texto = `%${texto}%`;
      return or(
        like(tabelaProdutos.nome, _texto),
        like(tabelaProdutos.sku, _texto),
        like(tabelaProdutos.codigoBarra, _texto),
        like(tabelaProdutos.descricao, _texto),
        // like(tabelaProdutos.categoria, _texto),
        like(tabelaProdutos.marca, _texto),
        like(tabelaProdutos.fornecedor, _texto),
        // like(tabelaProdutos.dimensoes, _texto),
        // like(tabelaProdutos.localizacao, _texto),
      )!;
    };

    const pagina = opts?.pagina || 1;
    const paginaTamanho = opts?.paginaTamanho || 100;

    return bancoDados
      .select()
      .from(tabelaProdutos)
      .where(
        and(
          opts?.comId ? comId(opts.comId) : undefined,
          opts?.comPrecoCustoMaiorIgualQue
            ? comPrecoCustoMaiorIgualQue(opts.comPrecoCustoMaiorIgualQue)
            : undefined,
          opts?.comPrecoCustoMenorIgualQue
            ? comPrecoCustoMenorIgualQue(opts.comPrecoCustoMenorIgualQue)
            : undefined,
          opts?.comPrecoVendaMaiorIgualQue
            ? comPrecoVendaMaiorIgualQue(opts.comPrecoVendaMaiorIgualQue)
            : undefined,
          opts?.comPrecoVendaMenorIgualQue
            ? comPrecoVendaMenorIgualQue(opts.comPrecoVendaMenorIgualQue)
            : undefined,
          opts?.comPrecoPromocaoMaiorIgualQue
            ? comPrecoPromocaoMaiorIgualQue(opts.comPrecoPromocaoMaiorIgualQue)
            : undefined,
          opts?.comPrecoPromocaoMenorIgualQue
            ? comPrecoPromocaoMenorIgualQue(opts.comPrecoPromocaoMenorIgualQue)
            : undefined,
          opts?.comPesoMaiorIgualQue
            ? comPesoMaiorIgualQue(opts.comPesoMaiorIgualQue)
            : undefined,
          opts?.comPesoMenorIgualQue
            ? comPesoMenorIgualQue(opts.comPesoMenorIgualQue)
            : undefined,
          opts?.comCategoria ? comCategoria(opts.comCategoria) : undefined,
          opts?.comTexto ? comTexto(opts.comTexto) : undefined,
        ),
      )
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  selecionarConsultaComQuantidade(
    opts?: RepoConsultaParamsProdutoQuantidade,
  ): Promise<SelectProdutosSchema[]> {
    const comId = (id: string): SQL => eq(tabelaProdutos.id, id);
    const comPrecoCustoMaiorIgualQue = (valor: number): SQL =>
      gte(tabelaProdutos.precoCusto, valor);
    const comPrecoCustoMenorIgualQue = (valor: number): SQL =>
      lte(tabelaProdutos.precoCusto, valor);
    const comPrecoVendaMaiorIgualQue = (valor: number): SQL =>
      gte(tabelaProdutos.precoVenda, valor);
    const comPrecoVendaMenorIgualQue = (valor: number): SQL =>
      lte(tabelaProdutos.precoVenda, valor);
    const comPrecoPromocaoMaiorIgualQue = (valor: number): SQL =>
      gte(tabelaProdutos.precoPromocao, valor);
    const comPrecoPromocaoMenorIgualQue = (valor: number): SQL =>
      lte(tabelaProdutos.precoPromocao, valor);
    const comPesoMaiorIgualQue = (valor: number): SQL =>
      gte(tabelaProdutos.peso, valor);
    const comPesoMenorIgualQue = (valor: number): SQL =>
      lte(tabelaProdutos.peso, valor);
    const comCategoria = (categoria: string): SQL =>
      eq(tabelaProdutos.categoria, categoria);
    const comTexto = (texto: string): SQL => {
      const _texto = `%${texto}%`;
      return or(
        like(tabelaProdutos.nome, _texto),
        like(tabelaProdutos.sku, _texto),
        like(tabelaProdutos.codigoBarra, _texto),
        like(tabelaProdutos.descricao, _texto),
        // like(tabelaProdutos.categoria, _texto),
        like(tabelaProdutos.marca, _texto),
        like(tabelaProdutos.fornecedor, _texto),
        // like(tabelaProdutos.dimensoes, _texto),
        // like(tabelaProdutos.localizacao, _texto),
      )!;
    };

    const comQuantidadeMaiorIgualQue = (valor: number): SQL =>
      gte(sql`quantidade_total`, valor);
    const comQuantidadeMenorIgualQue = (valor: number): SQL =>
      lte(sql`quantidade_total`, valor);

    const pagina = opts?.pagina || 1;
    const paginaTamanho = opts?.paginaTamanho || 100;

    return bancoDados
      .select({
        ...getTableColumns(tabelaProdutos),
        quantidade: sql<number>`sum(${tabelaLotes.quantidade})`.as(
          "quantidade_total",
        ),
      })
      .from(tabelaProdutos)
      .leftJoin(tabelaLotes, eq(tabelaProdutos.id, tabelaLotes.produtoId))
      .groupBy(tabelaProdutos.id)
      .orderBy(asc(tabelaProdutos.id))
      .having(
        and(
          opts?.comQuantidadeMaiorIgualQue
            ? comQuantidadeMaiorIgualQue(opts.comQuantidadeMaiorIgualQue)
            : undefined,
          opts?.comQuantidadeMenorIgualQue
            ? comQuantidadeMenorIgualQue(opts.comQuantidadeMenorIgualQue)
            : undefined,
        ),
      )
      .where(
        and(
          opts?.comId ? comId(opts.comId) : undefined,
          opts?.comPrecoCustoMaiorIgualQue
            ? comPrecoCustoMaiorIgualQue(opts.comPrecoCustoMaiorIgualQue)
            : undefined,
          opts?.comPrecoCustoMenorIgualQue
            ? comPrecoCustoMenorIgualQue(opts.comPrecoCustoMenorIgualQue)
            : undefined,
          opts?.comPrecoVendaMaiorIgualQue
            ? comPrecoVendaMaiorIgualQue(opts.comPrecoVendaMaiorIgualQue)
            : undefined,
          opts?.comPrecoVendaMenorIgualQue
            ? comPrecoVendaMenorIgualQue(opts.comPrecoVendaMenorIgualQue)
            : undefined,
          opts?.comPrecoPromocaoMaiorIgualQue
            ? comPrecoPromocaoMaiorIgualQue(opts.comPrecoPromocaoMaiorIgualQue)
            : undefined,
          opts?.comPrecoPromocaoMenorIgualQue
            ? comPrecoPromocaoMenorIgualQue(opts.comPrecoPromocaoMenorIgualQue)
            : undefined,
          opts?.comPesoMaiorIgualQue
            ? comPesoMaiorIgualQue(opts.comPesoMaiorIgualQue)
            : undefined,
          opts?.comPesoMenorIgualQue
            ? comPesoMenorIgualQue(opts.comPesoMenorIgualQue)
            : undefined,
          opts?.comCategoria ? comCategoria(opts.comCategoria) : undefined,
          opts?.comTexto ? comTexto(opts.comTexto) : undefined,
        ),
      )
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  atualizarPorId(id: string, produto: UpdateProdutosSchema): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaProdutos)
        .set(produto)
        .where(eq(tabelaProdutos.id, id));
      return resultSet.rowsAffected;
    });
  }

  async iniciarTransacao(
    callback: (
      tx: SQLiteTransaction<
        "async",
        ResultSet,
        Record<string, never>,
        ExtractTablesWithRelations<Record<string, never>>
      >,
    ) => Promise<unknown>,
  ): Promise<void> {
    await bancoDados.transaction(callback);
  }

  async atualizarPorIdTransaction(
    id: string,
    produto: UpdateProdutosSchema,
    tx: SQLiteTransaction<
      "async",
      ResultSet,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >,
  ): Promise<unknown> {
    return await tx
      .update(tabelaProdutos)
      .set(produto)
      .where(eq(tabelaProdutos.id, id));
  }

  // or .returning()
  excluirPorId(id: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaProdutos)
        .where(eq(tabelaProdutos.id, id));
      return resultSet.rowsAffected;
    });
  }

  contar(): Promise<Count | undefined> {
    return bancoDados.select({ count: count() }).from(tabelaProdutos).get();
  }
}

const repositorioProdutos = new RepositorioProdutos();

export default repositorioProdutos;
