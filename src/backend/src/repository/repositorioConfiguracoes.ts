import { eq } from "drizzle-orm";
import baseDados from "../db";
import {
  tabelaConfiguracoes,
  type InsertConfiguracaoSchema,
  type SelectConfiguracaoSchema,
  type UpdateConfiguracaoSchema,
} from "../db/schema/configuracoes";

export class RepositorioConfiguracoes {
  inserir(
    configuracoes: InsertConfiguracaoSchema,
  ): Promise<SelectConfiguracaoSchema[]> {
    return baseDados.transaction((tx) => {
      return tx.insert(tabelaConfiguracoes).values(configuracoes).returning();
    });
  }

  selecionarPorId(id: string): Promise<SelectConfiguracaoSchema | null> {
    return baseDados.transaction(async (tx) => {
      const res = await tx
        .select()
        .from(tabelaConfiguracoes)
        .where(eq(tabelaConfiguracoes.id, id));
      if (res.length === 1) return res[0]!;
      return null;
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
          .from(tabelaConfiguracoes)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return tx.select().from(tabelaConfiguracoes);
      }
    });
  }

  atualizarPorId(
    id: string,
    configuracoes: UpdateConfiguracaoSchema,
  ): Promise<number> {
    return baseDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaConfiguracoes)
        .set(configuracoes)
        .where(eq(tabelaConfiguracoes.id, id));
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  excluirPorId(id: string) {
    return baseDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaConfiguracoes)
        .where(eq(tabelaConfiguracoes.id, id));
      return resultSet.rowsAffected;
    });
  }
}
