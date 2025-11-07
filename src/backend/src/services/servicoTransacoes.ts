import z from "zod";
import { RepositorioTransacoes } from "../repository/repositorioTransacoes";
import { debug } from "../logging";
import type { InsertTransacoesSchema } from "../db/schema/transacoes";
import { HttpError } from "../error";
import type { UuidResult } from "../api/v1/objects";

const repositorioTransacoes = new RepositorioTransacoes();

export const ParamsConsultaTransacoesZ = z.strictObject({
  id: z.uuid().optional(),
  produtoId: z.uuid().optional(),
  usuarioId: z.uuid().optional(),
  loteId: z.uuid().optional(),
  // corce: os parametros são recebidos como string
  pagina: z.coerce.number().int().gt(0).optional(),
  paginaTamanho: z.coerce.number().int().gt(0).optional(),
  dataApos: z.coerce.date().optional(),
  dataAntes: z.coerce.date().optional(),
});

export type ParamsConsultaTransacoes = z.infer<
  typeof ParamsConsultaTransacoesZ
>;

export class ServicoTransacoes {
  async inserir(transacao: InsertTransacoesSchema): Promise<UuidResult> {
    const res = await repositorioTransacoes.inserir(transacao);
    if (res.length !== 1 || !res[0]) throw new HttpError("", 500);
    debug(`Nova transação criada!`, { label: "ServTransacoes" });
    return res[0];
  }

  async selecionarConsulta(opts?: ParamsConsultaTransacoes) {
    let query = repositorioTransacoes.selecionarQuery();
    if (opts) {
      if (opts.id) {
        query = query.comId(opts.id);
      }
      if (opts.produtoId) {
        query = query.comProdutoId(opts.produtoId);
      }
      if (opts.usuarioId) {
        query = query.comUsuarioId(opts.usuarioId);
      }
      if (opts.loteId) {
        query = query.comLoteId(opts.loteId);
      }
      query = query.comPaginacao(opts.pagina, opts.paginaTamanho);
      if (opts.dataApos) {
        query = query.comDataMaiorQue(opts.dataApos);
      }
      if (opts.dataAntes) {
        query = query.comDataMenorQue(opts.dataAntes);
      }
    }
    const res = await query.executarConsulta();
    debug(`Retornando transações selecionadas`, { label: "ServTransacoes" });
    return res;
  }

  selecionarTodos() {
    return repositorioTransacoes.selecionarTodos(0, 0);
  }
}

const servicoTransacoes = new ServicoTransacoes();

export default servicoTransacoes;
