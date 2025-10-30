import type { InsertCategoriaSchema } from "../db/schema/categorias";
import { RepositorioCategorias } from "../repository/repositorioCategorias";

const repositorioCategorias = new RepositorioCategorias();

class ServicoCategorias {
  // TODO: Verificar se categoria já existe ou colocar nome como "unico"
  inserir(categoria: InsertCategoriaSchema) {
    return repositorioCategorias.inserir(categoria);
  }

  selecionarPorId(id: string) {
    return repositorioCategorias.selecionarPorId(id);
  }

  selecionarTodos() {
    return repositorioCategorias.selecionarTodos();
  }

  // TODO: validar UUID
  excluirPorId(id: string) {
    return repositorioCategorias.excluirPorId(id);
  }
}

const servicoCategorias = new ServicoCategorias();

export default servicoCategorias;
