import "dotenv/config";
import {
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
import bancoDados from "../db";
import { tabelaCategorias } from "../db/schema/categorias";
import { tabelaLotes } from "../db/schema/lotes";
import {
  type InsertProdutosSchema,
  type SelectProdutosSchema,
  type UpdateProdutosSchema,
  tabelaProdutos,
} from "../db/schema/produtos";
import type { Count, RefRegistro } from "./common";
import {
  RepositorioBase,
  type SQLiteTransactionCustom,
} from "./repositorioBase";

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
  comCategoriaId?: string;
  comTexto?: string;
};

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
const comCategoriaId = (categoriaId: string): SQL =>
  eq(tabelaProdutos.categoriaId, categoriaId);
const comTexto = (texto: string): SQL => {
  const _texto = `%${texto}%`;
  return or(
    like(tabelaProdutos.nome, _texto),
    like(tabelaProdutos.sku, _texto),
    like(tabelaProdutos.codigoBarra, _texto),
    like(tabelaProdutos.descricao, _texto),
    like(tabelaProdutos.marca, _texto),
    like(tabelaProdutos.fornecedor, _texto),
    // like(tabelaProdutos.localizacao, _texto),
    // like(tabelaProdutos.dimensoes, _texto),
  )!;
};

const comQuantidadeMaiorIgualQue = (valor: number): SQL =>
  gte(sql`quantidade_total`, valor);
const comQuantidadeMenorIgualQue = (valor: number): SQL =>
  lte(sql`quantidade_total`, valor);

export type RepoConsultaParamsProdutoQuantidade = RepoConsultaParamsProduto & {
  comQuantidadeMenorIgualQue?: number;
  comQuantidadeMaiorIgualQue?: number;
};

export type SelectConsultaProdutosSchema = SelectProdutosSchema & {
  quantidade: number;
  categoria: string | null;
};

class RepositorioProdutos extends RepositorioBase {
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

  selecionarPorCategoriaId(id: string): Promise<Count | undefined> {
    return bancoDados
      .select({ count: count() })
      .from(tabelaProdutos)
      .where(eq(tabelaProdutos.categoriaId, id))
      .get();
  }

  selecionarPorUnidadeMedida(id: string): Promise<Count | undefined> {
    return bancoDados
      .select({ count: count() })
      .from(tabelaProdutos)
      .where(eq(tabelaProdutos.unidadeMedidaId, id))
      .get();
  }

  selecionarConsulta(
    opts?: RepoConsultaParamsProduto,
  ): Promise<SelectProdutosSchema[]> {
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
          opts?.comCategoriaId
            ? comCategoriaId(opts.comCategoriaId)
            : undefined,
          opts?.comTexto ? comTexto(opts.comTexto) : undefined,
        ),
      )
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  selecionarConsultaCompleta(
    opts?: RepoConsultaParamsProdutoQuantidade,
  ): Promise<SelectConsultaProdutosSchema[]> {
    const pagina = opts?.pagina || 1;
    const paginaTamanho = opts?.paginaTamanho || 100;

    return bancoDados
      .select({
        ...getTableColumns(tabelaProdutos),
        quantidade: sql<number>`sum(${tabelaLotes.quantidade})`.as(
          "quantidade_total",
        ),
        categoria: tabelaCategorias.nome,
      })
      .from(tabelaProdutos)
      .leftJoin(tabelaLotes, eq(tabelaProdutos.id, tabelaLotes.produtoId))
      .leftJoin(
        tabelaCategorias,
        eq(tabelaProdutos.categoriaId, tabelaCategorias.id),
      )
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
          opts?.comCategoriaId
            ? comCategoriaId(opts.comCategoriaId)
            : undefined,
          opts?.comTexto ? comTexto(opts.comTexto) : undefined,
        ),
      )
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  atualizarPorId(id: string, valores: UpdateProdutosSchema): Promise<number> {
    valores.updatedAt = new Date();
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaProdutos)
        .set(valores)
        .where(eq(tabelaProdutos.id, id));
      return resultSet.rowsAffected;
    });
  }

  async atualizarPorIdTransacao(
    tx: SQLiteTransactionCustom,
    id: string,
    valores: UpdateProdutosSchema,
  ): Promise<unknown> {
    valores.updatedAt = new Date();
    return await tx
      .update(tabelaProdutos)
      .set(valores)
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
