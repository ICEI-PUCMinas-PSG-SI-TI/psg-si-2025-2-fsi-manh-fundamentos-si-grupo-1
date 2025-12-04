import { MotivoTransacoes } from "../db/enum/motivoTransacao";
import { ServerError } from "../error";
import repositorioMovimentacoes, {
  type RepoConsultaParamsTransacoes,
} from "../repository/repositorioTransacoes";
import z from "zod";
import * as z4 from "zod/v4";

export const GetMovimentacaoDtoZ = z4.strictObject({
  id: z4.uuid(),
  produtoId: z4.uuid(),
  usuarioId: z4.uuid(),
  loteId: z4.uuid(),
  motivo: z4.string(),
  quantidade: z4.int(),
  horario: z4.iso.datetime(),
  localOrigem: z4.string().nullable().optional(),
  localDestino: z4.string().nullable().optional(),
  observacao: z4.string().nullable().optional(),
});

export type GetMovimentacaoDto = z4.infer<typeof GetMovimentacaoDtoZ>;

export const SetMovimentacaoDtoZ = z4.strictObject({
  produtoId: z4.uuid(),
  usuarioId: z4.uuid(),
  loteId: z4.uuid(),
  motivo: z4.enum(MotivoTransacoes),
  quantidade: z4.int(),
  horario: z4.iso.datetime(),
  localOrigem: z4.string().optional(),
  localDestino: z4.string().optional(),
  observacao: z4.string().optional(),
});

export type SetMovimentacaoDto = z4.infer<typeof SetMovimentacaoDtoZ>;

export const ConsultaMovimentacoesParamsZ = z4.strictObject({
  id: z4.uuid().optional(),
  produtoId: z4.uuid().optional(),
  usuarioId: z4.uuid().optional(),
  loteId: z4.uuid().optional(),
  // corce: os parametros são recebidos como string
  pagina: z4.coerce.number().int().gt(0).optional(),
  paginaTamanho: z4.coerce.number().int().gt(0).optional(),
  dataApos: z4.iso.datetime().optional(),
  dataAntes: z4.iso.datetime().optional(),
  motivo: z.enum(MotivoTransacoes).optional(),
});

export type ConsultaMovimentacoesParams = z4.infer<
  typeof ConsultaMovimentacoesParamsZ
>;

export const GetConsultaMovimentacaoDtoZ = GetMovimentacaoDtoZ.extend({
  _usuario: z4.object({ nome: z4.string() }),
  _categoria: z4.object({ nome: z4.string() }).optional(),
  _produto: z4.strictObject({
    nome: z4.string(),
    codigo: z4.string(),
  }),
  _lote: z4.object({ codigo: z4.string() }),
});

export type GetConsultaMovimentacaoDto = z.infer<
  typeof GetConsultaMovimentacaoDtoZ
>;

class ServicoTransacoes {
  async inserir(valores: SetMovimentacaoDto): Promise<string> {
    const res = await repositorioMovimentacoes.inserir({
      loteId: valores.loteId,
      motivo: valores.motivo,
      produtoId: valores.produtoId,
      quantidade: valores.quantidade,
      usuarioId: valores.usuarioId,
      horario: new Date(valores.horario),
      localDestino: valores.localDestino,
      localOrigem: valores.localOrigem,
      observacao: valores.observacao,
    });
    if (res[0]) {
      return res[0].id;
    } else {
      throw new ServerError("Não foi possível registrar a movimentação!");
    }
  }

  async selecionarConsulta(
    opts?: ConsultaMovimentacoesParams,
  ): Promise<GetConsultaMovimentacaoDto[]> {
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
    if (opts?.motivo) {
      filtros.comMotivo = opts.motivo;
    }

    const registros =
      await repositorioMovimentacoes.selecionarConsulta(filtros);
    return registros.map((registro) => {
      if (
        registro._usuario === null ||
        // registro._categoria === null ||
        registro._produto === null ||
        registro._lote === null
      ) {
        throw new ServerError("Houve um erro ao verificar os registros.");
      } else {
        return {
          id: registro.id,
          produtoId: registro.produtoId,
          usuarioId: registro.usuarioId,
          loteId: registro.loteId,
          motivo: registro.motivo,
          quantidade: registro.quantidade,
          horario: registro.horario.toISOString(),
          localOrigem: registro.localOrigem,
          localDestino: registro.localDestino,
          observacao: registro.observacao,
          _usuario: { nome: registro._usuario.nome },
          _categoria: registro._categoria
            ? { nome: registro._categoria.nome }
            : undefined,
          _produto: {
            nome: registro._produto.nome,
            codigo: registro._produto.codigo,
          },
          _lote: { codigo: registro._lote.codigo },
        };
      }
    });
  }

  async selecionarTodos(): Promise<GetMovimentacaoDto[]> {
    const registros = await repositorioMovimentacoes.selecionarTodos();
    return registros.map((registro) => ({
      id: registro.id,
      produtoId: registro.produtoId,
      usuarioId: registro.usuarioId,
      loteId: registro.loteId,
      motivo: registro.motivo,
      quantidade: registro.quantidade,
      horario: new Date(registro.horario).toISOString(),
      localOrigem: registro.localOrigem,
      localDestino: registro.localDestino,
      observacao: registro.observacao,
    }));
  }
}

const servicoTransacoes = new ServicoTransacoes();

export default servicoTransacoes;
