import { ServerError } from "../error";
import repositorioLotes, {
  type RepoConsultaParamsLote,
} from "../repository/repositorioLotes";
import * as z4 from "zod/v4";

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

export type ConsultaLoteParams = z4.infer<typeof LoteConsultaSchema>;

export const SetLoteDtoZ = z4.object({
  produtoId: z4.uuid(),
  codigo: z4.string(),
  quantidade: z4.number(),
  validade: z4.string().nullable(),
});

export type SetLoteDTO = z4.infer<typeof SetLoteDtoZ>;

export type GetLoteDTO = {
  id: string;
  produtoId: string;
  codigo: string;
  quantidade: number;
  validade: string | null;
};

export const UpdateLoteDtoZ = z4.strictObject({
  codigo: z4.string().min(1).optional(),
  quantidade: z4.number().optional(),
  validade: z4.iso.datetime().optional().nullable(),
});

export type UpdateLoteDTO = z4.infer<typeof UpdateLoteDtoZ>;

class ServicoLotes {
  async inserir(lote: SetLoteDTO): Promise<string> {
    // TODO: Verificar se Id do produto existe ou deixar dar erro na base de dados?
    const res = await repositorioLotes.inserir({
      produtoId: lote.produtoId,
      codigo: lote.codigo,
      quantidade: lote.quantidade | 0,
      validade: lote.validade ? new Date(lote.validade) : null,
    });
    if (!res[0]) {
      throw new ServerError("Não foi possível criar categoria.");
    } else {
      return res[0].id;
    }
  }

  async selecionarPorId(id: string): Promise<GetLoteDTO | null> {
    const registro = await repositorioLotes.selecionarPorId(id);
    if (registro) {
      return {
        id: registro.id,
        produtoId: registro.produtoId,
        codigo: registro.codigo,
        quantidade: registro.quantidade,
        validade: registro.validade ? registro.validade.toISOString() : null,
      };
    } else {
      return null;
    }
  }

  async selecionarConsulta(opts?: ConsultaLoteParams): Promise<GetLoteDTO[]> {
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
    const consulta = await repositorioLotes.selecionarConsulta(filters);
    return consulta.map((registro) => ({
      id: registro.id,
      produtoId: registro.produtoId,
      codigo: registro.codigo,
      quantidade: registro.quantidade,
      validade: registro.validade ? registro.validade.toISOString() : null,
    }));
  }

  async selecionarTodos(): Promise<GetLoteDTO[]> {
    const registros = await repositorioLotes.selecionarTodos();
    return registros.map((registro) => ({
      id: registro.id,
      produtoId: registro.produtoId,
      codigo: registro.codigo,
      quantidade: registro.quantidade,
      validade: registro.validade ? registro.validade.toISOString() : null,
    }));
  }

  // TEST: As atualizações substituem todos os campos ou so alguns? (e se utilizar undefined?)
  async atualizar(id: string, lote: UpdateLoteDTO): Promise<boolean> {
    const registro = await repositorioLotes.selecionarPorId(id);
    if (registro) {
      const atualizacoes = await repositorioLotes.atualizarPorId(id, {
        codigo: lote.codigo,
        quantidade: lote.quantidade,
        validade: lote.validade ? new Date(lote.validade) : null,
      });
      if (atualizacoes > 0) {
        return true;
      } else {
        throw new ServerError("Erro ao atualizar lote.");
      }
    } else {
      return false;
    }
  }

  async excluirPorId(id: string): Promise<boolean> {
    const registro = await repositorioLotes.selecionarPorId(id);
    if (registro) {
      const atualizacoes = await repositorioLotes.excluirPorId(id);
      if (atualizacoes > 0) {
        return true;
      } else {
        throw new ServerError("Não foi possível excluir a categoria.");
      }
    } else {
      return false;
    }
  }

  async contar(): Promise<number> {
    const res = await repositorioLotes.contar();
    return res!.count;
  }
}

const servicoLotes = new ServicoLotes();

export default servicoLotes;
