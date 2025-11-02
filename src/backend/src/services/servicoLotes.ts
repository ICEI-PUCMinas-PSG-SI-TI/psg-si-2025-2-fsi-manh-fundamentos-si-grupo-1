import z from "zod";
import { debug } from "../logging";
import { RepositorioLotes } from "../repository/repositorioLotes";
import type { InsertLoteSchema, UpdateLoteSchema } from "../db/schema/lotes";

export const LoteConsultaSchema = z.strictObject({
  id: z.uuid().optional(),
  produtoId: z.uuid().optional(),
  pagina: z.coerce.number().int().gt(0).optional(),
  paginaTamanho: z.coerce.number().int().gt(0).optional(),
  quantidadeMin: z.coerce.number().optional(),
  quantidadeMax: z.coerce.number().optional(),
  validadeAte: z.iso.datetime().optional(),
  validadeApos: z.iso.datetime().optional(),
  lote: z.string().min(1).optional(),
});

type LoteConsultaZ = z.infer<typeof LoteConsultaSchema>;

const repositorioLotes = new RepositorioLotes();

export class ServicoLotes {
  async inserir(lote: InsertLoteSchema) {
    const res = await repositorioLotes.inserir(lote);
    if (res && res > 0) {
      debug(`Novo lote criado!`, { label: "LoteService" });
    }
    return res;
  }

  async selecionarPorId(id: string) {
    const res = await repositorioLotes.selecionarPorId(id);
    debug(`Retornando lote ${id}`, { label: "LoteService" });
    return res;
  }

  async selecionarConsulta(opts?: LoteConsultaZ) {
    let query = repositorioLotes.selecionarQuery();
    if (opts) {
      if (opts.id) {
        query = query.comId(opts.id);
      }
      if (opts.produtoId) {
        query = query.comProdutoId(opts.produtoId);
      }
      if (opts.lote) {
        query = query.comLote(opts.lote);
      }
      query = query.comPaginacao(opts.pagina, opts.paginaTamanho);
      if (opts.validadeApos) {
        const validadeApos = new Date(opts.validadeApos);
        query = query.comValidadeMaiorIgualQue(validadeApos);
      }
      if (opts.validadeAte) {
        const validadeAte = new Date(opts.validadeAte);
        query = query.comValidadeMenorIgualQue(validadeAte);
      }
      if (opts.quantidadeMin) {
        query = query.comQuantidadeMaiorIgualQue(opts.quantidadeMin);
      }
      if (opts.quantidadeMax) {
        query = query.comQuantidadeMenorIgualQue(opts.quantidadeMax);
      }
    }
    const res = await query.executarConsulta();
    debug(`Retornando lotes selecionados`, { label: "LoteService" });
    return res;
  }

  async selecionarTodos() {
    const res = await repositorioLotes.selecionarTodos();
    debug(`Retornando lotes`, { label: "LoteService" });
    return res;
  }

  async atualizar(id: string, lote: UpdateLoteSchema) {
    const res = await repositorioLotes.atualizarPorId(id, lote);
    debug(`Informações do lote ${id} atualizadas!`, {
      label: "LoteService",
    });
    return res;
  }

  async excluirPorId(id: string) {
    const res = await repositorioLotes.excluirPorId(id);
    debug(`Informações do lote ${id} excluidas!`, {
      label: "LoteService",
    });
    return res;
  }
}
