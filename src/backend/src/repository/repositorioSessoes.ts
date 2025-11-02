import "dotenv/config";
import { eq } from "drizzle-orm";
import {
  sessoesTable as tabelaSessoes,
  type InsertSessaoSchema,
  type SelectSessaoSchema,
} from "../db/schema/sessoes";
import bancoDados from "../db";

export class RepositorioSessoes {
  async inserir(sessao: InsertSessaoSchema) {
    return await bancoDados.transaction(async (tx) => {
      return (await tx.insert(tabelaSessoes).values(sessao)).lastInsertRowid;
    });
  }

  selecionarPorId(id: string): Promise<SelectSessaoSchema | null> {
    return bancoDados.transaction(async (tx) => {
      const res = await tx
        .select()
        .from(tabelaSessoes)
        .where(eq(tabelaSessoes.id, id));
      if (res.length && res[0]) return res[0];
      return null;
    });
  }

  async selecionarTodos(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<SelectSessaoSchema[]> {
    return await bancoDados.transaction(async (tx) => {
      if (page >= 1 && pageSize >= 1) {
        return await tx
          .select()
          .from(tabelaSessoes)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return await tx.select().from(tabelaSessoes);
      }
    });
  }

  // or .returning()
  async excluirPorId(id: string): Promise<number> {
    return await bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaSessoes)
        .where(eq(tabelaSessoes.id, id));
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  async excluirPorUsuarioId(usuarioId: string): Promise<number> {
    return await bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaSessoes)
        .where(eq(tabelaSessoes.usuarioId, usuarioId));
      return resultSet.rowsAffected;
    });
  }
}
