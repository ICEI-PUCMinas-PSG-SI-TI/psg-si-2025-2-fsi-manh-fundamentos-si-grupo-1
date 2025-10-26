import { eq, like } from "drizzle-orm";
import baseDados from "../db";
import {
  categoriasTable as categoriasTable,
  type InsertCategoriaSchema,
  type SelectCategoriaSchema,
} from "../db/schema/categorias";

export class RepositorioCategorias {
  async inserir(categoria: InsertCategoriaSchema) {
    return await baseDados.transaction(async (tx) => {
      return (await tx.insert(categoriasTable).values(categoria))
        .lastInsertRowid;
    });
  }

  async selecionarPorId(id: string): Promise<SelectCategoriaSchema[]> {
    return await baseDados.transaction(async (tx) => {
      return await tx
        .select()
        .from(categoriasTable)
        .where(eq(categoriasTable.id, id));
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
          .from(categoriasTable)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return await tx.select().from(categoriasTable);
      }
    });
  }

  async selecionarLike(nome: string) {
    return await baseDados.transaction(async (tx) => {
      return await tx
        .select()
        .from(categoriasTable)
        .where(like(categoriasTable.nome, `%${nome}%`));
    });
  }

  async excluirPorId(id: string) {
    return await baseDados.transaction(async (tx) => {
      // or .returning()
      return (
        await tx.delete(categoriasTable).where(eq(categoriasTable.id, id))
      ).rowsAffected;
    });
  }
}
