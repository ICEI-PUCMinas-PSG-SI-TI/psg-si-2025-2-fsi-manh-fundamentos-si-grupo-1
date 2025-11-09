import { eq, like } from "drizzle-orm";
import baseDados from "../db";
import {
  tabelaCategorias,
  type InsertCategoriaSchema,
  type SelectCategoriaSchema,
} from "../db/schema/categorias";

export class RepositorioCategorias {
  inserir(categoria: InsertCategoriaSchema) {
    return baseDados.transaction((tx) => {
      return tx.insert(tabelaCategorias).values(categoria).returning({
        id: tabelaCategorias.id,
      });
    });
  }

  async selecionarPorId(id: string): Promise<SelectCategoriaSchema[]> {
    return await baseDados.transaction(async (tx) => {
      return await tx
        .select()
        .from(tabelaCategorias)
        .where(eq(tabelaCategorias.id, id));
    });
  }

  async selecionarTodos(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<SelectCategoriaSchema[]> {
    return await baseDados.transaction(async (tx) => {
      if (page >= 1 && pageSize >= 1) {
        return await tx
          .select()
          .from(tabelaCategorias)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return await tx.select().from(tabelaCategorias);
      }
    });
  }

  async selecionarLike(nome: string) {
    return await baseDados.transaction(async (tx) => {
      return await tx
        .select()
        .from(tabelaCategorias)
        .where(like(tabelaCategorias.nome, `%${nome}%`));
    });
  }

  async excluirPorId(id: string) {
    return await baseDados.transaction(async (tx) => {
      // or .returning()
      return (
        await tx.delete(tabelaCategorias).where(eq(tabelaCategorias.id, id))
      ).rowsAffected;
    });
  }
}
