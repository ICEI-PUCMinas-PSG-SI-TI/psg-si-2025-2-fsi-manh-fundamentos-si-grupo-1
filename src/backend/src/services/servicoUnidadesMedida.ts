import type { InsertUnidadesMedidaSchema } from "../db/schema/unidadesMedida";
import { RepositorioUnidadesMedida } from "../repository/repositorioUnidadesMedidas";

const repositorioUnidadesMedida = new RepositorioUnidadesMedida();

class ServicoUnidadesMedida {
  inserir(unidadesMedida: InsertUnidadesMedidaSchema) {
    return repositorioUnidadesMedida.inserir(unidadesMedida);
  }

  selecionarPorId(id: string) {
    return repositorioUnidadesMedida.selecionarPorId(id);
  }

  selecionarTodos() {
    return repositorioUnidadesMedida.selecionarTodos(0, 0);
  }

  // TODO: validar UUID
  excluirPorId(id: string) {
    return repositorioUnidadesMedida.excluirPorId(id);
  }
}

const servicoUnidadesMedida = new ServicoUnidadesMedida();

export default servicoUnidadesMedida;
