import bancoDados from "../db";
import {
  type InsertUnidadesMedidaSchema,
  type SelectUnidadesMedidaSchema,
  type UpdateUnidadesMedidaSchema,
  tabelaUnidadesMedida,
} from "../db/schema/unidadesMedida";
import type { Count, RefRegistro } from "./common";
import "dotenv/config";
import { count, eq } from "drizzle-orm";

class RepositorioUnidadesMedida {
  inserir(
    ...unidadeMedida: InsertUnidadesMedidaSchema[]
  ): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx
        .insert(tabelaUnidadesMedida)
        .values(unidadeMedida)
        .onConflictDoNothing()
        .returning({
          id: tabelaUnidadesMedida.id,
        });
    });
  }

  inserirIgnorandoDuplicatas(
    ...unidadeMedida: InsertUnidadesMedidaSchema[]
  ): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx
        .insert(tabelaUnidadesMedida)
        .values(unidadeMedida)
        .onConflictDoNothing()
        .returning({
          id: tabelaUnidadesMedida.id,
        });
    });
  }

  selecionarPorId(id: string): Promise<SelectUnidadesMedidaSchema | undefined> {
    return bancoDados
      .select()
      .from(tabelaUnidadesMedida)
      .where(eq(tabelaUnidadesMedida.id, id))
      .get();
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

  selecionarIdsTodos(): Promise<RefRegistro[]> {
    return bancoDados
      .select({
        id: tabelaUnidadesMedida.id,
      })
      .from(tabelaUnidadesMedida);
  }

  atualizarPorId(
    id: string,
    valores: UpdateUnidadesMedidaSchema,
  ): Promise<number> {
    valores.updatedAt = new Date();
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaUnidadesMedida)
        .set(valores)
        .where(eq(tabelaUnidadesMedida.id, id));
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  excluirPorId(id: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaUnidadesMedida)
        .where(eq(tabelaUnidadesMedida.id, id));
      return resultSet.rowsAffected;
    });
  }

  contar(): Promise<Count | undefined> {
    return bancoDados
      .select({ count: count() })
      .from(tabelaUnidadesMedida)
      .get();
  }
}

const repositorioUnidadesMedida = new RepositorioUnidadesMedida();

export default repositorioUnidadesMedida;
