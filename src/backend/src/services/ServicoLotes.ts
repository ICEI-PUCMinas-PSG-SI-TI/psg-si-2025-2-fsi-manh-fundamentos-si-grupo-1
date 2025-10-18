import z from "zod";
import type { InsertLoteSchema, UpdateLote } from "../db/schema";
import { debug } from "../logging";
import { RepositorioLotes } from "../repository/RepositorioLotes";

export const loteConsultaSchema = z.object({
  paginacao: z
    .object({
      page: z.number().int().gt(0),
      pageSize: z.number().int().gt(0),
    })
    .optional(),
  quantidade: z
    .object({
      min: z.number().optional().default(-Infinity),
      max: z.number().optional().default(Infinity),
    })
    .optional(),
  validade: z
    .object({
      min: z.iso.datetime().optional().default("1970-01-01T00:00:00.000Z"),
      max: z.iso.datetime().optional().default("3000-01-01T00:00:00.000Z"),
    })
    .optional(),
  lote: z.string().min(1).optional(),
});

type LoteConsultaZ = z.infer<typeof loteConsultaSchema>;

const repositorioLotes = new RepositorioLotes();

export class LoteService {
  async inserir(lote: InsertLoteSchema) {
    const res = await repositorioLotes.inserir(lote);
    if (res && res > 0) {
      debug(`Novo lote criado!`, { label: "LoteService" });
    }
  }

  async selecionarPorId(id: string) {
    const res = await repositorioLotes.selecionarPorId(id);
    debug(`Retornando lote ${id}`, { label: "LoteService" });
    return res;
  }

  async selecionarConsulta(opts?: LoteConsultaZ) {
    let query = repositorioLotes.selecionarQuery();
    if (opts) {
      if (typeof opts.lote === "string") {
        query = query.comLote(opts.lote);
      }
      if (opts.paginacao) {
        query = query.comPaginacao(
          opts.paginacao.page,
          opts.paginacao.pageSize
        );
      }
      if (opts.quantidade) {
        query = query.comQuantidade(opts.quantidade.min, opts.quantidade.max);
      }
      if (opts.validade) {
        query = query.comValidadeEntre(
          new Date(opts.validade.min),
          new Date(opts.validade.max)
        );
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

  async atualizar(id: string, lote: UpdateLote) {
    const res = await repositorioLotes.atualizarPorId(id, lote);
    debug(`Informações do lote ${id} atualizadas!`, {
      label: "LoteService",
    });
    return res;
  }

  async excluirPorId(id: string) {
    const res = repositorioLotes.excluirPorId(id);
    debug(`Informações do lote ${id} excluidas!`, {
      label: "LoteService",
    });
    return res;
  }
}
