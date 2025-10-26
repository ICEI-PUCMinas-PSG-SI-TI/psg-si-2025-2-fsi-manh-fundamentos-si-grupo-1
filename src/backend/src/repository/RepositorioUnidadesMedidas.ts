import "dotenv/config";
import { eq } from "drizzle-orm";
import bancoDados from "../db";
import {
  unidadesMedidaTable,
  type InsertUnidadesMedidaSchema,
  type SelectUnidadesMedidaSchema,
  type UpdateUnidadesMedidaSchema,
} from "../db/schema/unidades-medida";

export class RepositorioUnidadesMedida {
  async inserir(unidadeMedida: InsertUnidadesMedidaSchema) {
    return await bancoDados.transaction(async (tx) => {
      return (await tx.insert(unidadesMedidaTable).values(unidadeMedida))
        .lastInsertRowid;
    });
  }

  async selecionarPorId(id: string): Promise<SelectUnidadesMedidaSchema[]> {
    return await bancoDados.transaction(async (tx) => {
      return await tx
        .select()
        .from(unidadesMedidaTable)
        .where(eq(unidadesMedidaTable.id, id));
    });
  }

  async selecionarTodos(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<SelectUnidadesMedidaSchema[]> {
    return await bancoDados.transaction(async (tx) => {
      if (page >= 1 && pageSize >= 1) {
        return await tx
          .select()
          .from(unidadesMedidaTable)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return await tx.select().from(unidadesMedidaTable);
      }
    });
  }

  async atualizarPorId(
    id: string,
    unidadeMedida: UpdateUnidadesMedidaSchema,
  ): Promise<number> {
    return await bancoDados.transaction(async (tx) => {
      return (
        await tx
          .update(unidadesMedidaTable)
          .set(unidadeMedida)
          .where(eq(unidadesMedidaTable.id, id))
      ).rowsAffected;
    });
  }

  async excluirPorId(id: string) {
    return await bancoDados.transaction(async (tx) => {
      // or .returning()
      return (
        await tx
          .delete(unidadesMedidaTable)
          .where(eq(unidadesMedidaTable.id, id))
      ).rowsAffected;
    });
  }
}
