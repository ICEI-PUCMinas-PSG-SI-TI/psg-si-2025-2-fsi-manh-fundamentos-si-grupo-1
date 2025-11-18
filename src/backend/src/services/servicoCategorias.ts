import type { UuidResult } from "../api/v1/objects";
import type { InsertCategoriaSchema } from "../db/schema/categorias";
import { HttpError } from "../error";
import { RepositorioCategorias } from "../repository/repositorioCategorias";

const repositorioCategorias = new RepositorioCategorias();

class ServicoCategorias {
  // TODO: Verificar se categoria já existe ou colocar nome como "unico"
  async inserir(categoria: InsertCategoriaSchema): Promise<UuidResult> {
    const res = await repositorioCategorias.inserir(categoria);
    if (res.length !== 1 || !res[0]) throw new HttpError("", 500);
    return res[0];
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

  async contar() {
    const res = await repositorioCategorias.contar();
    return res ? res.count : undefined;
  }
}

const servicoCategorias = new ServicoCategorias();

export default servicoCategorias;
