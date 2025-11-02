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

  selecionarIdTodos() {
    return repositorioUnidadesMedida.selecionarIdTodos();
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
