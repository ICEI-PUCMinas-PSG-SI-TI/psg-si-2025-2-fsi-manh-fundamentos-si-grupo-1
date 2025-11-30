import bancoDados from "../db";
import {
  type InsertConfiguracaoSchema,
  type SelectConfiguracaoSchema,
  type UpdateConfiguracaoSchema,
  tabelaConfiguracoes,
} from "../db/schema/configuracoes";
import { eq } from "drizzle-orm";

class RepositorioConfiguracoes {
  inserir(
    configuracoes: InsertConfiguracaoSchema,
  ): Promise<SelectConfiguracaoSchema[]> {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaConfiguracoes).values(configuracoes).returning();
    });
  }

  selecionarPorId(id: string): Promise<SelectConfiguracaoSchema | undefined> {
    return bancoDados
      .select()
      .from(tabelaConfiguracoes)
      .where(eq(tabelaConfiguracoes.id, id))
      .get();
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
    valores: UpdateConfiguracaoSchema,
  ): Promise<number> {
    valores.updatedAt = new Date();
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaConfiguracoes)
        .set(valores)
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

const repositorioConfiguracoes = new RepositorioConfiguracoes();

export default repositorioConfiguracoes;
