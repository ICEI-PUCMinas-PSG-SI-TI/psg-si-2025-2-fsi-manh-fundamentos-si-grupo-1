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

  selecionarPorId(id: string): Promise<SelectUnidadesMedidaSchema[]> {
    return bancoDados
      .select()
      .from(tabelaUnidadesMedida)
      .where(eq(tabelaUnidadesMedida.id, id));
  }

  selecionarTodos(): Promise<SelectUnidadesMedidaSchema[]> {
    return bancoDados.select().from(tabelaUnidadesMedida);
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectUnidadesMedidaSchema[]> {
    return bancoDados
      .select()
      .from(tabelaUnidadesMedida)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
  }

  selecionarIdsTodos(): Promise<{ id: string }[]> {
    return bancoDados
      .select({
        id: tabelaUnidadesMedida.id,
      })
      .from(tabelaUnidadesMedida);
  }

  atualizarPorId(
    id: string,
    unidadeMedida: UpdateUnidadesMedidaSchema,
  ): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaUnidadesMedida)
        .set(unidadeMedida)
        .where(eq(tabelaUnidadesMedida.id, id));
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  excluirPorId(id: string) {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaUnidadesMedida)
        .where(eq(tabelaUnidadesMedida.id, id));
      return resultSet.rowsAffected;
    });
  }

  contar() {
    return bancoDados.select({ count: count() }).from(tabelaUnidadesMedida);
  }
}
