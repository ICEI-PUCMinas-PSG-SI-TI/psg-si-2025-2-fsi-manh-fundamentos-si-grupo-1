import bancoDados from "../db";
import { Permissoes } from "../db/enums/permissoes";
import {
  type InsertPermissoesSchema,
  type SelectPermissoesSchema,
  tabelaPermissoes,
} from "../db/schema/permissoes";
import { RepositorioBase } from "./repositorioBase";
import { and, eq } from "drizzle-orm";

class RepositorioPermissoes extends RepositorioBase {
  inserir(...perms: InsertPermissoesSchema[]): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const res = await tx
        .insert(tabelaPermissoes)
        .values(perms)
        .onConflictDoNothing()
        .execute();
      return res.rowsAffected;
    });
  }

  selecionarTodos(): Promise<SelectPermissoesSchema[]> {
    return bancoDados.select().from(tabelaPermissoes).execute();
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectPermissoesSchema[]> {
    return bancoDados
      .select()
      .from(tabelaPermissoes)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  selecionar(
    userId: string,
    cargo: Permissoes,
  ): Promise<SelectPermissoesSchema[]> {
    return bancoDados
      .select()
      .from(tabelaPermissoes)
      .where(
        and(
          eq(tabelaPermissoes.usuarioId, userId),
          eq(tabelaPermissoes.cargo, cargo),
        ),
      )
      .execute();
  }

  selecionarPorIdUsuario(userId: string): Promise<SelectPermissoesSchema[]> {
    return bancoDados
      .select()
      .from(tabelaPermissoes)
      .where(eq(tabelaPermissoes.usuarioId, userId))
      .execute();
  }

  selecionarPersmissoesPorCargo(
    cargo: Permissoes,
  ): Promise<SelectPermissoesSchema[]> {
    return bancoDados
      .select()
      .from(tabelaPermissoes)
      .where(eq(tabelaPermissoes.cargo, cargo))
      .execute();
  }

  excluir(userId: string, cargo: Permissoes): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaPermissoes)
        .where(
          and(
            eq(tabelaPermissoes.usuarioId, userId),
            eq(tabelaPermissoes.cargo, cargo),
          ),
        )
        .execute();
      return resultSet.rowsAffected;
    });
  }

  excluirPermissoes(userId: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaPermissoes)
        .where(eq(tabelaPermissoes.usuarioId, userId))
        .execute();
      return resultSet.rowsAffected;
    });
  }
}

const repositorioPermissoes = new RepositorioPermissoes();

export default repositorioPermissoes;
