import type { UuidResult } from "../api/v1/objects";
import type {
  InsertTransacoesSchema,
  SelectTransacoesSchema,
} from "../db/schema/transacoes";
import { HttpError } from "../error";
import { debug } from "../logging";
import {
  type RepoConsultaParamsTransacoes,
  RepositorioTransacoes,
} from "../repository/repositorioTransacoes";
import * as z4 from "zod/v4";

const repositorioTransacoes = new RepositorioTransacoes();

export const ParamsConsultaTransacoesZ = z4.strictObject({
  id: z4.uuid().optional(),
  produtoId: z4.uuid().optional(),
  usuarioId: z4.uuid().optional(),
  loteId: z4.uuid().optional(),
  // corce: os parametros são recebidos como string
  pagina: z4.coerce.number().int().gt(0).optional(),
  paginaTamanho: z4.coerce.number().int().gt(0).optional(),
  dataApos: z4.coerce.date().optional(),
  dataAntes: z4.coerce.date().optional(),
});

export type ParamsConsultaTransacoes = z4.infer<
  typeof ParamsConsultaTransacoesZ
>;

export class ServicoTransacoes {
  async inserir(transacao: InsertTransacoesSchema): Promise<UuidResult> {
    const res = await repositorioTransacoes.inserir(transacao);
    if (res.length !== 1 || !res[0]) {
      throw new HttpError("", 500);
    }
    debug(`Nova transação criada!`, { label: "ServTransacoes" });
    return res[0];
  }

  // HACK: Criar DTO para essa função
  // TODO: Criar DTO para essa função
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  selecionarConsulta(opts?: ParamsConsultaTransacoes) {
    const filtros = {
      comId: opts?.id,
      comProdutoId: opts?.produtoId,
      comUsuarioId: opts?.usuarioId,
      comLoteId: opts?.loteId,
    } as RepoConsultaParamsTransacoes;

    if (opts?.dataApos) {
      filtros.comDataMaiorQue = new Date(opts.dataApos);
    }
    if (opts?.dataAntes) {
      filtros.comDataMenorQue = new Date(opts.dataAntes);
    }
    if (opts?.pagina && opts?.paginaTamanho) {
      filtros.pagina = opts?.pagina;
      filtros.paginaTamanho = opts?.paginaTamanho;
    }

    debug(`Retornando transações selecionadas`, { label: "ServTransacoes" });
    return repositorioTransacoes.selecionarConsulta(filtros);
  }

  selecionarTodos(): Promise<SelectTransacoesSchema[]> {
    return repositorioTransacoes.selecionarTodos();
  }
}

const servicoTransacoes = new ServicoTransacoes();

export default servicoTransacoes;
