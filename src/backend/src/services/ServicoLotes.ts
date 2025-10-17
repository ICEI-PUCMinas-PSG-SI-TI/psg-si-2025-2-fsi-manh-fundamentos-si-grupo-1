import z from "zod";
import type { InsertLote, SelectLote, UpdateLote } from "../db/schema";
import { debug } from "../logging";
import { RepositorioLotes } from "../repository/RepositorioLotes";
import { stringify as stringifyUUID } from "uuid";
import { parseUuidBuffer } from "../tooling";

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

function updateUUID(result: SelectLote[]) {
  result.forEach((value, index, array) => {
    if (!array[index]) return;
    array[index].id = stringifyUUID(parseUuidBuffer(value.id));
    array[index].produto_id = stringifyUUID(parseUuidBuffer(value.produto_id));
  });
  return result;
}

const repositorioLotes = new RepositorioLotes();

export class LoteService {
  async inserir(lote: InsertLote) {
    const res = await repositorioLotes.inserir(lote);
    if (res && res > 0) {
      debug(`Novo lote criado!`, { label: "LoteService" });
    }
  }

  async selecionarPorId(id: Uint8Array) {
    let res = await repositorioLotes.selecionarPorId(id);
    const strId = stringifyUUID(id);
    debug(`Retornando lote ${strId}`, { label: "LoteService" });
    res = updateUUID(res);
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
    let res = await query.executarConsulta();
    res = updateUUID(res);
    debug(`Retornando lotes selecionados`, { label: "LoteService" });
    return res;
  }

  async selecionarTodos() {
    let res = await repositorioLotes.selecionarTodos();
    debug(`Retornando lotes`, { label: "LoteService" });
    res = updateUUID(res);
    return res;
  }

  async atualizar(id: Uint8Array, lote: UpdateLote) {
    const res = await repositorioLotes.atualizarPorId(id, lote);
    const strId = stringifyUUID(id);
    debug(`Informações do lote ${strId} atualizadas!`, {
      label: "LoteService",
    });
    return res;
  }

  async excluir(id: Uint8Array) {
    const res = repositorioLotes.excluirPorId(id);
    const strId = stringifyUUID(id);
    debug(`Informações do lote ${strId} excluidas!`, {
      label: "LoteService",
    });
    return res;
  }
}
