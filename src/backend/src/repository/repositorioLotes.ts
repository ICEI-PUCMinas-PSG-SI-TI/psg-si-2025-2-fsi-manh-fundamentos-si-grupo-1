import "dotenv/config";
import { SQL, and, count, eq, gte, like, lte } from "drizzle-orm";
import bancoDados from "../db";
import type {
  InsertLoteSchema,
  SelectLoteSchema,
  UpdateLoteSchema,
} from "../db/schema/lotes";
import { tabelaLotes } from "../db/schema/lotes";
import type { Count, RefRegistro } from "./common";

export type RepoConsultaParamsLote = {
  pagina?: number;
  paginaTamanho?: number;
  comCodigo?: string;
  comId?: string;
  comProdutoId?: string;
  comValidadeMaiorIgualQue?: Date;
  comValidadeMenorIgualQue?: Date;
  comQuantidadeMaiorIgualQue?: number;
  comQuantidadeMenorIgualQue?: number;
};

class RepositorioLotes {
  inserir(...lote: InsertLoteSchema[]): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx
        .insert(tabelaLotes)
        .values(lote)
        .returning({
          id: tabelaLotes.id,
        })
        .execute();
    });
  }

  selecionarPorId(id: string): Promise<SelectLoteSchema | undefined> {
    return bancoDados
      .select()
      .from(tabelaLotes)
      .where(eq(tabelaLotes.id, id))
      .get();
  }

  selecionarTodos(): Promise<SelectLoteSchema[]> {
    return bancoDados.select().from(tabelaLotes).execute();
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectLoteSchema[]> {
    return bancoDados
      .select()
      .from(tabelaLotes)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  selecionarConsulta(
    opts?: RepoConsultaParamsLote,
  ): Promise<SelectLoteSchema[]> {
    const comCodigo = (lote: string): SQL =>
      like(tabelaLotes.codigo, `%${lote}%`);
    const comId = (id: string): SQL => eq(tabelaLotes.id, id);
    const comProdutoId = (id: string): SQL => eq(tabelaLotes.produtoId, id);
    const comValidadeMaiorIgualQue = (data: Date): SQL =>
      gte(tabelaLotes.validade, data);
    const comValidadeMenorIgualQue = (data: Date): SQL =>
      lte(tabelaLotes.validade, data);
    const comQuantidadeMaiorIgualQue = (valor: number): SQL =>
      gte(tabelaLotes.quantidade, valor);
    const comQuantidadeMenorIgualQue = (valor: number): SQL =>
      lte(tabelaLotes.quantidade, valor);

    const pagina = opts?.pagina || 1;
    const paginaTamanho = opts?.paginaTamanho || 100;

    return bancoDados
      .select()
      .from(tabelaLotes)
      .where(
        and(
          opts?.comCodigo ? comCodigo(opts.comCodigo) : undefined,
          opts?.comId ? comId(opts.comId) : undefined,
          opts?.comProdutoId ? comProdutoId(opts.comProdutoId) : undefined,
          opts?.comValidadeMaiorIgualQue
            ? comValidadeMaiorIgualQue(opts.comValidadeMaiorIgualQue)
            : undefined,
          opts?.comValidadeMenorIgualQue
            ? comValidadeMenorIgualQue(opts.comValidadeMenorIgualQue)
            : undefined,
          opts?.comQuantidadeMaiorIgualQue
            ? comQuantidadeMaiorIgualQue(opts.comQuantidadeMaiorIgualQue)
            : undefined,
          opts?.comQuantidadeMenorIgualQue
            ? comQuantidadeMenorIgualQue(opts.comQuantidadeMenorIgualQue)
            : undefined,
        ),
      )
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  selecionarIdProdutosTodos(): Promise<{ id: string; produtoId: string }[]> {
    return bancoDados
      .select({
        id: tabelaLotes.id,
        produtoId: tabelaLotes.produtoId,
      })
      .from(tabelaLotes)
      .execute();
  }

  atualizarPorId(id: string, valores: UpdateLoteSchema): Promise<number> {
    valores.updatedAt = new Date();
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaLotes)
        .set(valores)
        .where(eq(tabelaLotes.id, id))
        .execute();
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  excluirPorId(id: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaLotes)
        .where(eq(tabelaLotes.id, id))
        .execute();
      return resultSet.rowsAffected;
    });
  }

  contar(): Promise<Count | undefined> {
    return bancoDados.select({ count: count() }).from(tabelaLotes).get();
  }
}

const repositorioLotes = new RepositorioLotes();

export default repositorioLotes;
