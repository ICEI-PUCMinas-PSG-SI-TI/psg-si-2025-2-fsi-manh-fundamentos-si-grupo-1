import type { UuidResult } from "../api/v1/objects";
import type { InsertUnidadesMedidaSchema } from "../db/schema/unidadesMedida";
import { HttpError } from "../error";
import { debug } from "../logging";
import { RepositorioUnidadesMedida } from "../repository/repositorioUnidadesMedida";

const repositorioUnidadesMedida = new RepositorioUnidadesMedida();

class ServicoUnidadesMedida {
  async inserir(
    unidadesMedida: InsertUnidadesMedidaSchema,
  ): Promise<UuidResult> {
    const res = await repositorioUnidadesMedida.inserir(unidadesMedida);
    if (res.length !== 1 || !res[0]) throw new HttpError("", 500);
    debug(`Nova unidade de medida criada!`, { label: "UnidadesMedidaServico" });
    return res[0];
  }

  selecionarPorId(id: string) {
    return repositorioUnidadesMedida.selecionarPorId(id);
  }

  selecionarTodos() {
    return repositorioUnidadesMedida.selecionarTodos();
  }

  selecionarIdTodos() {
    return repositorioUnidadesMedida.selecionarIdsTodos();
  }

  // TODO: validar UUID
  excluirPorId(id: string) {
    return repositorioUnidadesMedida.excluirPorId(id);
  }

  async contar() {
    const res = await repositorioUnidadesMedida.contar();
    if (!res[0]) return 0;
    return res[0].count;
  }
}

const servicoUnidadesMedida = new ServicoUnidadesMedida();

export default servicoUnidadesMedida;
