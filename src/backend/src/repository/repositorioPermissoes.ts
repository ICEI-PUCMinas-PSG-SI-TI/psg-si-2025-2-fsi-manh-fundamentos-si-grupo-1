import { and, eq } from "drizzle-orm";
import bancoDados from "../db";
import {
  tabelaPermissoes,
  type InsertPermissoesSchema,
  type SelectPermissoesSchema,
} from "../db/schema/permissoes";
import { Permissoes } from "../db/enums/permissoes";

export class RepositorioPermissoes {
  inserir(...perms: InsertPermissoesSchema[]) {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaPermissoes).values(perms).onConflictDoNothing();
    });
  }

  selecionarTodos(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<SelectPermissoesSchema[]> {
    return bancoDados.transaction((tx) => {
      if (page >= 1 && pageSize >= 1) {
        return tx
          .select()
          .from(tabelaPermissoes)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return tx.select().from(tabelaPermissoes);
      }
    });
  }

  selecionar(
    userId: string,
    cargo: Permissoes,
  ): Promise<SelectPermissoesSchema[]> {
    return bancoDados.transaction((tx) => {
      return tx
        .select()
        .from(tabelaPermissoes)
        .where(
          and(
            eq(tabelaPermissoes.usuarioId, userId),
            eq(tabelaPermissoes.cargo, cargo),
          ),
        );
    });
  }

  selecionarPersmissoesPorIdUsuario(
    userId: string,
  ): Promise<SelectPermissoesSchema[]> {
    return bancoDados.transaction((tx) => {
      return tx
        .select()
        .from(tabelaPermissoes)
        .where(eq(tabelaPermissoes.usuarioId, userId));
    });
  }

  selecionarPersmissoesPorCargo(
    cargo: Permissoes,
  ): Promise<SelectPermissoesSchema[]> {
    return bancoDados.transaction((tx) => {
      return tx
        .select()
        .from(tabelaPermissoes)
        .where(eq(tabelaPermissoes.cargo, cargo));
    });
  }

  async excluir(userId: string, cargo: Permissoes) {
    return await bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaPermissoes)
        .where(
          and(
            eq(tabelaPermissoes.usuarioId, userId),
            eq(tabelaPermissoes.cargo, cargo),
          ),
        );
      return resultSet.rowsAffected;
    });
  }

  excluirPermissoes(userId: string) {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaPermissoes)
        .where(eq(tabelaPermissoes.usuarioId, userId));
      return resultSet.rowsAffected;
    });
  }
}
