import "dotenv/config";
import { eq } from "drizzle-orm";
import {
  sessoesTable as tabelaSessoes,
  type InsertSessaoSchema,
  type SelectSessaoSchema,
  type UpdateSessaoSchema,
} from "../db/schema/sessoes";
import bancoDados from "../db";

export class RepositorioSessoes {
  async inserir(sessao: InsertSessaoSchema) {
    return await bancoDados.transaction(async (tx) => {
      return (await tx.insert(tabelaSessoes).values(sessao)).lastInsertRowid;
    });
  }

  async selecionarPorId(id: string): Promise<SelectSessaoSchema[]> {
    return await bancoDados.transaction(async (tx) => {
      return await tx
        .select()
        .from(tabelaSessoes)
        .where(eq(tabelaSessoes.id, id));
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

  async atualizarPorId(
    id: string,
    sessao: UpdateSessaoSchema,
  ): Promise<number> {
    return await bancoDados.transaction(async (tx) => {
      return (
        await tx
          .update(tabelaSessoes)
          .set(sessao)
          .where(eq(tabelaSessoes.id, id))
      ).rowsAffected;
    });
  }

  async excluirPorId(id: string) {
    return await bancoDados.transaction(async (tx) => {
      // or .returning()
      return (await tx.delete(tabelaSessoes).where(eq(tabelaSessoes.id, id)))
        .rowsAffected;
    });
  }
}
