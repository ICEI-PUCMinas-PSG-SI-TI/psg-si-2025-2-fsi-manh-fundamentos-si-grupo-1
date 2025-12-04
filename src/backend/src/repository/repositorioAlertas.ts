import {
  and,
  count,
  eq,
  getTableColumns,
  isNull,
  lte,
  or,
  SQL,
} from "drizzle-orm";
import bancoDados from "../db";
import type { MotivoAlerta } from "../db/enums/motivoAlerta";
import {
  type InsertAlertaSchema,
  type SelectAlertaSchema,
  type UpdateAlertaSchema,
  tabelaAlertas,
} from "../db/schema/alertas";
import { tabelaLotes } from "../db/schema/lotes";
import { tabelaProdutos } from "../db/schema/produtos";
import type { Count, RefRegistro } from "./common";
import { RepositorioBase } from "./repositorioBase";

export type RepoConsultaParamsAlerta = {
  pagina?: number;
  paginaTamanho?: number;
  comMotivo?: MotivoAlerta;
};

export type SelectConsultaAlertasSchema = SelectAlertaSchema & {
  _produto: { nome: string; codigo: string } | null;
  _lote: { codigo: string } | null;
};

class RepositorioAlertas extends RepositorioBase {
  inserir(...valores: InsertAlertaSchema[]): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaAlertas).values(valores).returning({
        id: tabelaAlertas.id,
      });
    });
  }

  selecionarPorId(id: string): Promise<SelectAlertaSchema | undefined> {
    return bancoDados
      .select()
      .from(tabelaAlertas)
      .where(eq(tabelaAlertas.id, id))
      .get();
  }

  selecionarTodos(): Promise<SelectAlertaSchema[]> {
    return bancoDados.select().from(tabelaAlertas).execute();
  }

  selecionarNaoMutados(): Promise<SelectAlertaSchema[]> {
    return bancoDados
      .select()
      .from(tabelaAlertas)
      .where(
        or(
          isNull(tabelaAlertas.mutadoAte),
          lte(tabelaAlertas.mutadoAte, new Date()),
        ),
      )
      .execute();
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectAlertaSchema[]> {
    return bancoDados
      .select()
      .from(tabelaAlertas)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  selecionarConsulta(
    opts?: RepoConsultaParamsAlerta,
  ): Promise<SelectConsultaAlertasSchema[]> {
    const comMotivo = (motivo: MotivoAlerta): SQL =>
      eq(tabelaAlertas.motivo, motivo);

    const pagina = opts?.pagina || 1;
    const paginaTamanho = opts?.paginaTamanho || 100;

    return bancoDados
      .select({
        ...getTableColumns(tabelaAlertas),
        _produto: {
          nome: tabelaProdutos.nome,
          codigo: tabelaProdutos.codigo,
        },
        _lote: {
          codigo: tabelaLotes.codigo,
        },
      })
      .from(tabelaAlertas)
      .where(
        and(
          opts?.comMotivo ? comMotivo(opts.comMotivo) : undefined,
          or(
            isNull(tabelaAlertas.mutadoAte),
            lte(tabelaAlertas.mutadoAte, new Date()),
          ),
        ),
      )
      .leftJoin(tabelaProdutos, eq(tabelaAlertas.produtoId, tabelaProdutos.id))
      .leftJoin(tabelaLotes, eq(tabelaAlertas.loteId, tabelaLotes.id))
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  atualizarPorId(id: string, valores: UpdateAlertaSchema): Promise<number> {
    valores.updatedAt = new Date();
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaAlertas)
        .set(valores)
        .where(eq(tabelaAlertas.id, id));
      return resultSet.rowsAffected;
    });
  }

  excluirTodos(): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx.delete(tabelaAlertas);
      return resultSet.rowsAffected;
    });
  }

  excluirPorId(id: string): Promise<number> {
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .delete(tabelaAlertas)
        .where(eq(tabelaAlertas.id, id));
      return resultSet.rowsAffected;
    });
  }

  contar(): Promise<Count | undefined> {
    return bancoDados.select({ count: count() }).from(tabelaAlertas).get();
  }

  contarNaoMutados(): Promise<Count | undefined> {
    return bancoDados
      .select({ count: count() })
      .from(tabelaAlertas)
      .where(
        or(
          isNull(tabelaAlertas.mutadoAte),
          lte(tabelaAlertas.mutadoAte, new Date()),
        ),
      )
      .get();
  }
}

const repositorioAlertas = new RepositorioAlertas();

export default repositorioAlertas;
