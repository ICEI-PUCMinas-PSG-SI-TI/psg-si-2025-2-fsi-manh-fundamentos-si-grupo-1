import { SQL, and, count, eq } from "drizzle-orm";
import bancoDados from "../db";
import type {
  InsertUsuarioSchema,
  SelectUsuarioSchema,
  UpdateUsuarioSchema,
} from "../db/schema/usuarios";
import { tabelaUsuarios } from "../db/schema/usuarios";
import type { Count, RefRegistro } from "./common";

export type RepoConsultaParamsUsuarios = {
  pagina?: number;
  paginaTamanho?: number;
  comId?: string;
  comLogin?: string;
};

class RepositorioUsuarios {
  inserir(...usuario: InsertUsuarioSchema[]): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaUsuarios).values(usuario).returning({
        id: tabelaUsuarios.id,
      });
    });
  }

  selecionarPorId(id: string): Promise<SelectUsuarioSchema | undefined> {
    return bancoDados
      .select()
      .from(tabelaUsuarios)
      .where(eq(tabelaUsuarios.id, id))
      .get();
  }

  selecionarTodos(): Promise<SelectUsuarioSchema[]> {
    return bancoDados.select().from(tabelaUsuarios);
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectUsuarioSchema[]> {
    return bancoDados
      .select()
      .from(tabelaUsuarios)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
  }

  selecionarPorLogin(login: string): Promise<SelectUsuarioSchema | undefined> {
    return bancoDados
      .select()
      .from(tabelaUsuarios)
      .where(eq(tabelaUsuarios.login, login))
      .get();
  }

  selecionarQuery(
    opts?: RepoConsultaParamsUsuarios,
  ): Promise<SelectUsuarioSchema[]> {
    const comId = (id: string): SQL => eq(tabelaUsuarios.id, id);
    const comLogin = (login: string): SQL => eq(tabelaUsuarios.login, login);

    const pagina = opts?.pagina || 1;
    const paginaTamanho = opts?.paginaTamanho || 100;

    return bancoDados
      .select()
      .from(tabelaUsuarios)
      .where(
        and(
          opts?.comId ? comId(opts.comId) : undefined,
          opts?.comLogin ? comLogin(opts.comLogin) : undefined,
        ),
      )
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  selecionarIdsTodos(): Promise<RefRegistro[]> {
    return bancoDados
      .select({
        id: tabelaUsuarios.id,
      })
      .from(tabelaUsuarios);
  }

  atualizarPorId(id: string, valores: UpdateUsuarioSchema): Promise<number> {
    valores.updatedAt = new Date();
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaUsuarios)
        .set(valores)
        .where(eq(tabelaUsuarios.id, id));
      return resultSet.rowsAffected;
    });
  }

  // or .returning()
  excluirPorId(id: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaUsuarios)
        .where(eq(tabelaUsuarios.id, id));
      return resultSet.rowsAffected;
    });
  }

  contar(): Promise<Count | undefined> {
    return bancoDados.select({ count: count() }).from(tabelaUsuarios).get();
  }
}

const repositorioUsuarios = new RepositorioUsuarios();

export default repositorioUsuarios;
