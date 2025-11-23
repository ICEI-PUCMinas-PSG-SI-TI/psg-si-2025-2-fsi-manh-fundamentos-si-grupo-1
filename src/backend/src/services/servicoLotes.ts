import * as z4 from "zod/v4";
import { debug } from "../logging";
import type {
  InsertLoteSchema,
  SelectLoteSchema,
  UpdateLoteSchema,
} from "../db/schema/lotes";
import {
  RepositorioLotes,
  type RepoConsultaParamsLote,
} from "../repository/repositorioLotes";

import { HttpError } from "../error";
import type { UuidResult } from "../api/v1/objects";

export const LoteConsultaSchema = z4.object({
  id: z4.uuid().optional(),
  produtoId: z4.uuid().optional(),
  pagina: z4.coerce.number().int().gt(0).optional(),
  paginaTamanho: z4.coerce.number().int().gt(0).optional(),
  quantidadeMin: z4.coerce.number().optional(),
  quantidadeMax: z4.coerce.number().optional(),
  validadeAte: z4.iso.datetime().optional(),
  validadeApos: z4.iso.datetime().optional(),
  codigo: z4.string().min(1).optional(),
});

export type LoteConsultaZ = z4.infer<typeof LoteConsultaSchema>;

const repositorioLotes = new RepositorioLotes();

export class ServicoLotes {
  async inserir(lote: InsertLoteSchema): Promise<UuidResult> {
    const res = await repositorioLotes.inserir(lote);
    if (res.length !== 1 || !res[0]) throw new HttpError("", 500);
    debug(`Novo lote criado!`, { label: "LoteService" });
    return res[0];
  }

  async selecionarPorId(id: string): Promise<SelectLoteSchema | null> {
    const res = await repositorioLotes.selecionarPorId(id);
    if (res) {
      return res;
      debug(`Retornando lote ${id}`, { label: "LoteService" });
    } else {
      return null;
    }
  }

  selecionarConsulta(opts?: LoteConsultaZ): Promise<SelectLoteSchema[]> {
    const filters = {
      comId: opts?.id,
      comProdutoId: opts?.produtoId,
      comCodigo: opts?.codigo,
      comQuantidadeMaiorIgualQue: opts?.quantidadeMin,
      comQuantidadeMenorIgualQue: opts?.quantidadeMax,
    } as RepoConsultaParamsLote;

    if (opts?.validadeApos) {
      const validadeApos = new Date(opts.validadeApos);
      filters.comValidadeMaiorIgualQue = validadeApos;
    }
    if (opts?.validadeAte) {
      const validadeAte = new Date(opts.validadeAte);
      filters.comValidadeMenorIgualQue = validadeAte;
    }
    if (opts?.pagina && opts?.paginaTamanho) {
      filters.pagina = opts?.pagina;
      filters.paginaTamanho = opts?.paginaTamanho;
    }
    const query = repositorioLotes.selecionarConsulta(filters);
    debug(`Retornando lotes selecionados`, { label: "LoteService" });
    return query;
  }

  async selecionarTodos(): Promise<SelectLoteSchema[]> {
    const res = await repositorioLotes.selecionarTodos();
    debug(`Retornando lotes`, { label: "LoteService" });
    return res;
  }

  // NOTE: Utilizar com cuidado, atualmente utilizado apenas para faker.js
  selecionarIdProdutosTodos(): Promise<{ id: string; produtoId: string }[]> {
    return repositorioLotes.selecionarIdProdutosTodos();
  }

  async atualizar(id: string, lote: UpdateLoteSchema): Promise<boolean> {
    const atualizacoes = await repositorioLotes.atualizarPorId(id, lote);
    debug(`Informações do lote ${id} atualizadas!`, {
      label: "LoteService",
    });
    return atualizacoes > 0;
  }

  async excluirPorId(id: string): Promise<boolean> {
    const atualizacoes = await repositorioLotes.excluirPorId(id);
    debug(`Informações do lote ${id} excluidas!`, {
      label: "LoteService",
    });
    return atualizacoes > 0;
  }

  async contar(): Promise<number | undefined> {
    const res = await repositorioLotes.contar();
    return res ? res.count : undefined;
  }
}

const servicoLotes = new ServicoLotes();

export default servicoLotes;
