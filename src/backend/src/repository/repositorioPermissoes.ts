import { and, eq } from "drizzle-orm";
import bancoDados from "../db";
import {
  tabelaPermissoes,
  type InsertPermissoesSchema,
  type SelectPermissoesSchema,
} from "../db/schema/permissoes";
import { Permissoes } from "../db/enums/permissoes";

export class RepositorioPermissoes {
  inserir(...perms: InsertPermissoesSchema[]): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const res = await tx
        .insert(tabelaPermissoes)
        .values(perms)
        .onConflictDoNothing();
      return res.rowsAffected;
    });
  }

  selecionarTodos(): Promise<SelectPermissoesSchema[]> {
    return bancoDados.select().from(tabelaPermissoes);
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectPermissoesSchema[]> {
    return bancoDados
      .select()
      .from(tabelaPermissoes)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
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
      );
  }

  selecionarPersmissoesPorIdUsuario(
    userId: string,
  ): Promise<SelectPermissoesSchema[]> {
    return bancoDados
      .select()
      .from(tabelaPermissoes)
      .where(eq(tabelaPermissoes.usuarioId, userId));
  }

  selecionarPersmissoesPorCargo(
    cargo: Permissoes,
  ): Promise<SelectPermissoesSchema[]> {
    return bancoDados
      .select()
      .from(tabelaPermissoes)
      .where(eq(tabelaPermissoes.cargo, cargo));
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
        );
      return resultSet.rowsAffected;
    });
  }

  excluirPermissoes(userId: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaPermissoes)
        .where(eq(tabelaPermissoes.usuarioId, userId));
      return resultSet.rowsAffected;
    });
  }
}

const repositorioPermissoes = new RepositorioPermissoes();

export default repositorioPermissoes;
