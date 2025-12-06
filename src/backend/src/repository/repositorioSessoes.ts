import "dotenv/config";
import { eq } from "drizzle-orm";
import bancoDados from "../db";
import {
  type InsertSessaoSchema,
  type SelectSessaoSchema,
  tabelaSessoes,
} from "../db/schema/sessoes";
import type { RefRegistro } from "./common";

class RepositorioSessoes {
  inserir(sessao: InsertSessaoSchema): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx
        .insert(tabelaSessoes)
        .values(sessao)
        .returning({
          id: tabelaSessoes.id,
        })
        .execute();
    });
  }

  selecionarPorId(id: string): Promise<SelectSessaoSchema | undefined> {
    return bancoDados
      .select()
      .from(tabelaSessoes)
      .where(eq(tabelaSessoes.id, id))
      .get();
  }

  selecionarTodos(): Promise<SelectSessaoSchema[]> {
    return bancoDados.select().from(tabelaSessoes).execute();
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectSessaoSchema[]> {
    return bancoDados
      .select()
      .from(tabelaSessoes)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  // or .returning()
  excluirPorId(id: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaSessoes)
        .where(eq(tabelaSessoes.id, id))
        .execute();
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  excluirPorUsuarioId(usuarioId: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaSessoes)
        .where(eq(tabelaSessoes.usuarioId, usuarioId))
        .execute();
      return resultSet.rowsAffected;
    });
  }

  excluirTodos(): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx.delete(tabelaSessoes).execute();
      return resultSet.rowsAffected;
    });
  }
}

const repositorioSessoes = new RepositorioSessoes();

export default repositorioSessoes;
