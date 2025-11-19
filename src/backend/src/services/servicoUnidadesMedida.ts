import type { UuidResult } from "../api/v1/objects";
import type {
  InsertUnidadesMedidaSchema,
  SelectUnidadesMedidaSchema,
} from "../db/schema/unidadesMedida";
import { HttpError } from "../error";
import { debug } from "../logging";
import type { RefRegistro } from "../repository/common";
import { RepositorioUnidadesMedida } from "../repository/repositorioUnidadesMedida";

const repositorioUnidadesMedida = new RepositorioUnidadesMedida();

class ServicoUnidadesMedida {
  async inserir(
    unidadesMedida: InsertUnidadesMedidaSchema,
  ): Promise<UuidResult> {
    const res = await repositorioUnidadesMedida.inserir(unidadesMedida);
    if (res.length !== 1 || !res[0]) {
      throw new HttpError("", 500);
    }
    debug(`Nova unidade de medida criada!`, { label: "UnidadesMedidaServico" });
    return res[0];
  }

  selecionarPorId(id: string): Promise<SelectUnidadesMedidaSchema | undefined> {
    return repositorioUnidadesMedida.selecionarPorId(id);
  }

  selecionarTodos(): Promise<SelectUnidadesMedidaSchema[]> {
    return repositorioUnidadesMedida.selecionarTodos();
  }

  selecionarIdTodos(): Promise<RefRegistro[]> {
    return repositorioUnidadesMedida.selecionarIdsTodos();
  }

  // TODO: validar UUID
  async excluirPorId(id: string): Promise<boolean> {
    const atualizacoes = await repositorioUnidadesMedida.excluirPorId(id);
    return atualizacoes > 0;
  }

  async contar(): Promise<number | undefined> {
    const res = await repositorioUnidadesMedida.contar();
    return res ? res.count : undefined;
  }
}

const servicoUnidadesMedida = new ServicoUnidadesMedida();

export default servicoUnidadesMedida;
