import "dotenv/config";
import { eq } from "drizzle-orm";
import {
  tabelaSessoes,
  type InsertSessaoSchema,
  type SelectSessaoSchema,
} from "../db/schema/sessoes";
import bancoDados from "../db";
import type { RefRegistro } from "./common";

export class RepositorioSessoes {
  inserir(sessao: InsertSessaoSchema): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaSessoes).values(sessao).returning({
        id: tabelaSessoes.id,
      });
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
    return bancoDados.select().from(tabelaSessoes);
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectSessaoSchema[]> {
    return bancoDados
      .select()
      .from(tabelaSessoes)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
  }

  // or .returning()
  excluirPorId(id: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaSessoes)
        .where(eq(tabelaSessoes.id, id));
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  excluirPorUsuarioId(usuarioId: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaSessoes)
        .where(eq(tabelaSessoes.usuarioId, usuarioId));
      return resultSet.rowsAffected;
    });
  }

  excluirTodos(): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx.delete(tabelaSessoes);
      return resultSet.rowsAffected;
    });
  }
}
