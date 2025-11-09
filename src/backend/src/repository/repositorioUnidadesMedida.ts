import "dotenv/config";
import { count, eq } from "drizzle-orm";
import bancoDados from "../db";
import {
  tabelaUnidadesMedida,
  type InsertUnidadesMedidaSchema,
  type SelectUnidadesMedidaSchema,
  type UpdateUnidadesMedidaSchema,
} from "../db/schema/unidadesMedida";

export class RepositorioUnidadesMedida {
  inserir(unidadeMedida: InsertUnidadesMedidaSchema) {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaUnidadesMedida).values(unidadeMedida).returning({
        id: tabelaUnidadesMedida.id,
      });
    });
  }

  async selecionarPorId(id: string): Promise<SelectUnidadesMedidaSchema[]> {
    return await bancoDados.transaction(async (tx) => {
      return await tx
        .select()
        .from(tabelaUnidadesMedida)
        .where(eq(tabelaUnidadesMedida.id, id));
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
          .from(tabelaUnidadesMedida)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return await tx.select().from(tabelaUnidadesMedida);
      }
    });
  }

  selecionarIdTodos(): Promise<{ id: string }[]> {
    return bancoDados.transaction((tx) => {
      return tx
        .select({
          id: tabelaUnidadesMedida.id,
        })
        .from(tabelaUnidadesMedida);
    });
  }

  async atualizarPorId(
    id: string,
    unidadeMedida: UpdateUnidadesMedidaSchema,
  ): Promise<number> {
    return await bancoDados.transaction(async (tx) => {
      return (
        await tx
          .update(tabelaUnidadesMedida)
          .set(unidadeMedida)
          .where(eq(tabelaUnidadesMedida.id, id))
      ).rowsAffected;
    });
  }

  async excluirPorId(id: string) {
    return await bancoDados.transaction(async (tx) => {
      // or .returning()
      return (
        await tx
          .delete(tabelaUnidadesMedida)
          .where(eq(tabelaUnidadesMedida.id, id))
      ).rowsAffected;
    });
  }

  contar() {
    return bancoDados.select({ count: count() }).from(tabelaUnidadesMedida);
  }
}
