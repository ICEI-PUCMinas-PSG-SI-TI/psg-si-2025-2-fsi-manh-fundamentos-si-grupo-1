import z from "zod";
import { RepositorioTransacoes } from "../repository/repositorioTransacoes";
import { debug } from "../logging";

const repositorioTransacoes = new RepositorioTransacoes();

export const TransacoesConsultaSchema = z.strictObject({
  id: z.uuid().optional(),
  produtoId: z.uuid().optional(),
  usuarioId: z.uuid().optional(),
  loteId: z.uuid().optional(),
  pagina: z.coerce.number().int().gt(0).optional(),
  paginaTamanho: z.coerce.number().int().gt(0).optional(),
  dataApos: z.coerce.date().optional(),
  dataAntes: z.coerce.date().optional(),
});

type TransacoesConsultaZ = z.infer<typeof TransacoesConsultaSchema>;

export class ServicoTransacoes {
  async selecionarConsulta(opts?: TransacoesConsultaZ) {
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
    debug(`Retornando lotes selecionados`, { label: "LoteService" });
    return res;
  }

  selecionarTodos() {
    return repositorioTransacoes.selecionarTodos(0, 0);
  }
}

const servicoTransacoes = new ServicoTransacoes();

export default servicoTransacoes;
