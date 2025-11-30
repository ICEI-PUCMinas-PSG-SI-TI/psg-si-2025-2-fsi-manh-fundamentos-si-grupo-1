import { count, eq, like } from "drizzle-orm";
import bancoDados from "../db";
import {
  type InsertCategoriaSchema,
  type SelectCategoriaSchema,
  tabelaCategorias,
} from "../db/schema/categorias";
import type { Count, RefRegistro } from "./common";

class RepositorioCategorias {
  inserir(...categoria: InsertCategoriaSchema[]): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaCategorias).values(categoria).returning({
        id: tabelaCategorias.id,
      });
    });
  }

  inserirIgnorandoDuplicatas(
    ...unidadeMedida: InsertCategoriaSchema[]
  ): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx
        .insert(tabelaCategorias)
        .values(unidadeMedida)
        .onConflictDoNothing()
        .returning({
          id: tabelaCategorias.id,
        });
    });
  }

  selecionarPorId(id: string): Promise<SelectCategoriaSchema | undefined> {
    return bancoDados
      .select()
      .from(tabelaCategorias)
      .where(eq(tabelaCategorias.id, id))
      .get();
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

  contar(): Promise<Count | undefined> {
    return bancoDados.select({ count: count() }).from(tabelaCategorias).get();
  }
}

const repositorioCategorias = new RepositorioCategorias();

export default repositorioCategorias;
