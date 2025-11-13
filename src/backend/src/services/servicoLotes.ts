import * as z4 from "zod/v4";
import { debug } from "../logging";
import { RepositorioLotes } from "../repository/repositorioLotes";
import type { InsertLoteSchema, UpdateLoteSchema } from "../db/schema/lotes";
import { HttpError } from "../error";
import type { UuidResult } from "../api/v1/objects";

export const LoteConsultaSchema = z4.strictObject({
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

  async selecionarPorId(id: string) {
    const res = await repositorioLotes.selecionarPorId(id);
    if (res.length === 0) return null;
    debug(`Retornando lote ${id}`, { label: "LoteService" });
    return res[0]!;
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
      if (opts.codigo) {
        query = query.comCodigo(opts.codigo);
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

  // NOTE: Utilizar com cuidado, atualmente utilizado apenas para faker.js
  selecionarIdProdutosTodos() {
    return repositorioLotes.selecionarIdProdutosTodos();
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

  async contar() {
    const res = await repositorioLotes.contar();
    if (!res[0]) return 0;
    return res[0].count;
  }
}

const servicoLotes = new ServicoLotes();

export default servicoLotes;
