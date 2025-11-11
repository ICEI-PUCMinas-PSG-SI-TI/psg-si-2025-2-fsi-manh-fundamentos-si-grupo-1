import { eq } from "drizzle-orm";
import bancoDados from "../db";
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
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaConfiguracoes).values(configuracoes).returning();
    });
  }

  async selecionarPorId(id: string): Promise<SelectConfiguracaoSchema | null> {
    const res = await bancoDados
      .select()
      .from(tabelaConfiguracoes)
      .where(eq(tabelaConfiguracoes.id, id));
    if (res.length === 1) return res[0]!;
    return null;
  }

  selecionarTodos(): Promise<SelectConfiguracaoSchema[]> {
    return bancoDados.select().from(tabelaConfiguracoes);
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectConfiguracaoSchema[]> {
    return bancoDados
      .select()
      .from(tabelaConfiguracoes)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
  }

  atualizarPorId(
    id: string,
    configuracoes: UpdateConfiguracaoSchema,
  ): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaConfiguracoes)
        .set(configuracoes)
        .where(eq(tabelaConfiguracoes.id, id));
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  excluirPorId(id: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaConfiguracoes)
        .where(eq(tabelaConfiguracoes.id, id));
      return resultSet.rowsAffected;
    });
  }
}
