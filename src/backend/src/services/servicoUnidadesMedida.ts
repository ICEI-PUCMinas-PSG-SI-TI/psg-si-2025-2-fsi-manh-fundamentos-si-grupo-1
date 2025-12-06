import * as z4 from "zod/v4";
import { ClientError, ServerError } from "../error";
import repositorioProdutos from "../repository/repositorioProdutos";
import repositorioUnidadesMedida from "../repository/repositorioUnidadesMedida";

export const SetUnidadeDtoZ = z4.object({
  nome: z4.string().min(1).max(128),
  abreviacao: z4.string().min(1).max(8),
});

export type SetUnidadeDTO = z4.infer<typeof SetUnidadeDtoZ>;

export type GetUnidadeDto = {
  id: string;
  nome: string;
  abreviacao: string;
};

class ServicoUnidadesMedida {
  // TODO: Verificar se entidade já existe
  async inserir(unidadesMedida: SetUnidadeDTO): Promise<string> {
    const res = await repositorioUnidadesMedida.inserir({
      nome: unidadesMedida.nome,
      abreviacao: unidadesMedida.abreviacao,
    });
    if (!res[0]) {
      throw new ServerError("Não foi possível criar categoria.");
    } else {
      return res[0].id;
    }
  }

  async selecionarPorId(id: string): Promise<GetUnidadeDto | null> {
    const registro = await repositorioUnidadesMedida.selecionarPorId(id);
    if (registro) {
      return {
        id: registro.id,
        nome: registro.nome,
        abreviacao: registro.abreviacao,
      };
    } else {
      return null;
    }
  }

  async selecionarTodos(): Promise<GetUnidadeDto[]> {
    const registros = await repositorioUnidadesMedida.selecionarTodos();
    return registros.map((r) => ({
      id: r.id,
      nome: r.nome,
      abreviacao: r.abreviacao,
    }));
  }

  async listarIds(): Promise<string[]> {
    const registros = await repositorioUnidadesMedida.selecionarIdsTodos();
    return registros.map((registro) => registro.id);
  }

  async excluirPorId(id: string): Promise<boolean> {
    const registro = await repositorioUnidadesMedida.selecionarPorId(id);
    if (registro) {
      const usos = await repositorioProdutos.selecionarPorUnidadeMedida(id);
      if (usos!.count > 0) {
        throw new ClientError("Há produtos cadastrados com essa unidade!", 409);
      }
      const atualizacoes = await repositorioUnidadesMedida.excluirPorId(id);
      if (atualizacoes > 0) {
        return true;
      } else {
        throw new ServerError("Não foi possível excluir a unidade.");
      }
    } else {
      return false;
    }
  }

  async contar(): Promise<number> {
    const res = await repositorioUnidadesMedida.contar();
    return res!.count;
  }
}

const servicoUnidadesMedida = new ServicoUnidadesMedida();

export default servicoUnidadesMedida;
