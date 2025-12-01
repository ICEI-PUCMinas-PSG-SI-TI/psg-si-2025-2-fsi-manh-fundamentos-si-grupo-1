import bancoDados from "../db";
import type { MotivoTransacoes } from "../db/enum/motivoTransacao";
import { tabelaCategorias } from "../db/schema/categorias";
import { tabelaLotes } from "../db/schema/lotes";
import { tabelaProdutos } from "../db/schema/produtos";
import {
  type InsertTransacoesSchema,
  type SelectTransacoesSchema,
  type UpdateTransacoesSchema,
  tabelaTransacoes,
} from "../db/schema/transacoes";
import { tabelaUsuarios } from "../db/schema/usuarios";
import type { RefRegistro } from "./common";
import "dotenv/config";
import "dotenv/config";
import "dotenv/config";
import { type SQL, and, eq, getTableColumns } from "drizzle-orm";

export type RepoConsultaParamsTransacoes = {
  pagina?: number;
  paginaTamanho?: number;
  comId?: string;
  comProdutoId?: string;
  comUsuarioId?: string;
  comLoteId?: string;
  comDataMaiorQue?: Date;
  comDataMenorQue?: Date;
  comMotivo?: MotivoTransacoes;
};

type SelectConsultaTransacoesSchema = SelectTransacoesSchema & {
  _usuario: { nome: string } | null;
  _categoria: { nome: string } | null;
  _produto: { nome: string; codigo: string } | null;
  _lote: { codigo: string } | null;
};

class RepositorioTransacoes {
  inserir(...transacao: InsertTransacoesSchema[]): Promise<RefRegistro[]> {
    return bancoDados.transaction((tx) => {
      return tx.insert(tabelaTransacoes).values(transacao).returning({
        id: tabelaTransacoes.id,
      });
    });
  }

  selecionarPorId(id: string): Promise<SelectTransacoesSchema | undefined> {
    return bancoDados
      .select()
      .from(tabelaTransacoes)
      .where(eq(tabelaTransacoes.id, id))
      .get();
  }

  selecionarTodos(): Promise<SelectTransacoesSchema[]> {
    return bancoDados.select().from(tabelaTransacoes);
  }

  selecionarPagina(
    pagina: number = 1,
    paginaTamanho: number = 10,
  ): Promise<SelectTransacoesSchema[]> {
    return bancoDados
      .select()
      .from(tabelaTransacoes)
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho);
  }

  selecionarConsulta(
    opts?: RepoConsultaParamsTransacoes,
  ): Promise<SelectConsultaTransacoesSchema[]> {
    const comId = (id: string): SQL => eq(tabelaTransacoes.id, id);
    const comProdutoId = (id: string): SQL =>
      eq(tabelaTransacoes.produtoId, id);
    const comUsuarioId = (id: string): SQL =>
      eq(tabelaTransacoes.usuarioId, id);
    const comLoteId = (id: string): SQL => eq(tabelaTransacoes.loteId, id);
    const comDataMaiorQue = (data: Date): SQL =>
      eq(tabelaTransacoes.horario, data);
    const comDataMenorQue = (data: Date): SQL =>
      eq(tabelaTransacoes.horario, data);
    const comMotivo = (motivo: MotivoTransacoes): SQL =>
      eq(tabelaTransacoes.motivo, motivo);

    const pagina = opts?.pagina || 1;
    const paginaTamanho = opts?.paginaTamanho || 100;

    return bancoDados
      .select({
        ...getTableColumns(tabelaTransacoes),
        _usuario: {
          nome: tabelaUsuarios.nome,
        },
        _categoria: {
          nome: tabelaCategorias.nome,
        },
        _produto: {
          nome: tabelaProdutos.nome,
          codigo: tabelaProdutos.codigo,
        },
        _lote: {
          codigo: tabelaLotes.codigo,
        },
      })
      .from(tabelaTransacoes)
      .where(
        and(
          opts?.comId ? comId(opts.comId) : undefined,
          opts?.comProdutoId ? comProdutoId(opts.comProdutoId) : undefined,
          opts?.comUsuarioId ? comUsuarioId(opts.comUsuarioId) : undefined,
          opts?.comLoteId ? comLoteId(opts.comLoteId) : undefined,
          opts?.comDataMaiorQue
            ? comDataMaiorQue(opts.comDataMaiorQue)
            : undefined,
          opts?.comDataMenorQue
            ? comDataMenorQue(opts.comDataMenorQue)
            : undefined,
          opts?.comMotivo ? comMotivo(opts.comMotivo) : undefined,
        ),
      )
      .leftJoin(
        tabelaUsuarios,
        eq(tabelaTransacoes.usuarioId, tabelaUsuarios.id),
      )
      .innerJoin(
        tabelaCategorias,
        eq(tabelaProdutos.categoriaId, tabelaCategorias.id),
      )
      .leftJoin(
        tabelaProdutos,
        eq(tabelaTransacoes.produtoId, tabelaProdutos.id),
      )
      .leftJoin(tabelaLotes, eq(tabelaTransacoes.loteId, tabelaLotes.id))
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  selecionarConsultaSimples(
    opts?: RepoConsultaParamsTransacoes,
  ): Promise<SelectTransacoesSchema[]> {
    const comId = (id: string): SQL => eq(tabelaTransacoes.id, id);
    const comProdutoId = (id: string): SQL =>
      eq(tabelaTransacoes.produtoId, id);
    const comUsuarioId = (id: string): SQL =>
      eq(tabelaTransacoes.usuarioId, id);
    const comLoteId = (id: string): SQL => eq(tabelaTransacoes.loteId, id);
    const comDataMaiorQue = (data: Date): SQL =>
      eq(tabelaTransacoes.horario, data);
    const comDataMenorQue = (data: Date): SQL =>
      eq(tabelaTransacoes.horario, data);

    const pagina = opts?.pagina || 1;
    const paginaTamanho = opts?.paginaTamanho || 100;

    return bancoDados
      .select()
      .from(tabelaTransacoes)
      .where(
        and(
          opts?.comId ? comId(opts.comId) : undefined,
          opts?.comProdutoId ? comProdutoId(opts.comProdutoId) : undefined,
          opts?.comUsuarioId ? comUsuarioId(opts.comUsuarioId) : undefined,
          opts?.comLoteId ? comLoteId(opts.comLoteId) : undefined,
          opts?.comDataMaiorQue
            ? comDataMaiorQue(opts.comDataMaiorQue)
            : undefined,
          opts?.comDataMenorQue
            ? comDataMenorQue(opts.comDataMenorQue)
            : undefined,
        ),
      )
      .limit(paginaTamanho)
      .offset((pagina - 1) * paginaTamanho)
      .execute();
  }

  atualizarPorId(id: string, valores: UpdateTransacoesSchema): Promise<number> {
    valores.updatedAt = new Date();
    return bancoDados.transaction(async (tx) => {
      const resultSet = await tx
        .update(tabelaTransacoes)
        .set(valores)
        .where(eq(tabelaTransacoes.id, id));
      return resultSet.rowsAffected;
    });
  }

  // TODO: Verificar se será possível excluir transações
}

const repositorioMovimentacoes = new RepositorioTransacoes();

export default repositorioMovimentacoes;

