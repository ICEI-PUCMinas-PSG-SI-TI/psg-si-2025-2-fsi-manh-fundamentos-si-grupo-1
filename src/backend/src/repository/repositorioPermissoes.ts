import { and, eq } from "drizzle-orm";
import baseDados from "../db";
import {
  Permissoes,
  permissoesTable,
  type InsertPermissoesSchema,
  type SelectPermissoesSchema,
} from "../db/schema/permissoes";

export class RepositorioPermissoes {
  inserir(...perms: InsertPermissoesSchema[]) {
    return baseDados.transaction((tx) => {
      return tx.insert(permissoesTable).values(perms).onConflictDoNothing();
    });
  }

  selecionarTodos(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<SelectPermissoesSchema[]> {
    return baseDados.transaction((tx) => {
      if (page >= 1 && pageSize >= 1) {
        return tx
          .select()
          .from(permissoesTable)
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        return tx.select().from(permissoesTable);
      }
    });
  }

  selecionar(
    userId: string,
    cargo: Permissoes,
  ): Promise<SelectPermissoesSchema[]> {
    return baseDados.transaction((tx) => {
      return tx
        .select()
        .from(permissoesTable)
        .where(
          and(
            eq(permissoesTable.usuarioId, userId),
            eq(permissoesTable.cargo, cargo),
          ),
        );
    });
  }

  selecionarPersmissoesPorIdUsuario(
    userId: string,
  ): Promise<SelectPermissoesSchema[]> {
    return baseDados.transaction((tx) => {
      return tx
        .select()
        .from(permissoesTable)
        .where(eq(permissoesTable.usuarioId, userId));
    });
  }

  selecionarPersmissoesPorCargo(
    cargo: Permissoes,
  ): Promise<SelectPermissoesSchema[]> {
    return baseDados.transaction((tx) => {
      return tx
        .select()
        .from(permissoesTable)
        .where(eq(permissoesTable.cargo, cargo));
    });
  }

  async excluir(userId: string, cargo: Permissoes) {
    return await baseDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(permissoesTable)
        .where(
          and(
            eq(permissoesTable.usuarioId, userId),
            eq(permissoesTable.cargo, cargo),
          ),
        );
      return resultSet.rowsAffected;
    });
  }
}
