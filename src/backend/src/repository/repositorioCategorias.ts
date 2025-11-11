import { eq, like, count } from "drizzle-orm";
import bancoDados from "../db";
import {
  tabelaCategorias,
  type InsertCategoriaSchema,
  type SelectCategoriaSchema,
} from "../db/schema/categorias";
import type { Count, RefRegistro } from "./common";

export class RepositorioCategorias {
  inserir(...categoria: InsertCategoriaSchema[]): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaCategorias).values(categoria).returning({
        id: tabelaCategorias.id,
      });
    });
  }

  selecionarPorId(id: string): Promise<SelectCategoriaSchema[]> {
    return bancoDados
      .select()
      .from(tabelaCategorias)
      .where(eq(tabelaCategorias.id, id));
  }

  selecionarTodos(): Promise<SelectCategoriaSchema[]> {
    return bancoDados.select().from(tabelaCategorias);
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectCategoriaSchema[]> {
    return bancoDados
      .select()
      .from(tabelaCategorias)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
  }

  selecionarLike(nome: string): Promise<SelectCategoriaSchema[]> {
    return bancoDados
      .select()
      .from(tabelaCategorias)
      .where(like(tabelaCategorias.nome, `%${nome}%`));
  }

  // or .returning()
  excluirPorId(id: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaCategorias)
        .where(eq(tabelaCategorias.id, id));
      return resultSet.rowsAffected;
    });
  }

  contar(): Promise<Count[]> {
    return bancoDados.select({ count: count() }).from(tabelaCategorias);
  }
}

const repositorioCategorias = new RepositorioCategorias();

export default repositorioCategorias;
