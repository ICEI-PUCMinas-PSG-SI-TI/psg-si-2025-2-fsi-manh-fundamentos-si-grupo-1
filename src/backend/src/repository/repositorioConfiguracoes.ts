import { eq } from "drizzle-orm";
import baseDados from "../db";
import {
  configuracoesTable,
  type InsertConfiguracaoSchema,
  type SelectConfiguracaoSchema,
  type UpdateConfiguracaoSchema,
} from "../db/schema/configuracoes";

export class RepositorioConfiguracoes {
  inserir(
    configuracoes: InsertConfiguracaoSchema,
  ): Promise<SelectConfiguracaoSchema[]> {
    return baseDados.transaction((tx) => {
      return tx.insert(configuracoesTable).values(configuracoes).returning();
    });
  }

  selecionarPorId(id: string): Promise<SelectConfiguracaoSchema[]> {
    return baseDados.transaction((tx) => {
      return tx
        .select()
        .from(configuracoesTable)
        .where(eq(configuracoesTable.id, id));
    });
  }

  selecionarTodos(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<SelectConfiguracaoSchema[]> {
    return baseDados.transaction((tx) => {
      if (page >= 1 && pageSize >= 1) {
        return tx
          .select()
          .from(configuracoesTable)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return tx.select().from(configuracoesTable);
      }
    });
  }

  atualizarPorId(
    id: string,
    configuracoes: UpdateConfiguracaoSchema,
  ): Promise<number> {
    return baseDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(configuracoesTable)
        .set(configuracoes)
        .where(eq(configuracoesTable.id, id));
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  excluirPorId(id: string) {
    return baseDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(configuracoesTable)
        .where(eq(configuracoesTable.id, id));
      return resultSet.rowsAffected;
    });
  }
}
