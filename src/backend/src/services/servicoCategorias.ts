import type { UuidResult } from "../api/v1/objects";
import type {
  InsertCategoriaSchema,
  SelectCategoriaSchema,
} from "../db/schema/categorias";
import { HttpError } from "../error";
import type { RefRegistro } from "../repository/common";
import { RepositorioCategorias } from "../repository/repositorioCategorias";

const repositorioCategorias = new RepositorioCategorias();

class ServicoCategorias {
  // TODO: Verificar se categoria já existe ou colocar nome como "unico"
  async inserir(categoria: InsertCategoriaSchema): Promise<UuidResult> {
    const res = await repositorioCategorias.inserir(categoria);
    if (res.length !== 1 || !res[0]) {
      throw new HttpError("", 500);
    } else {
      return res[0];
    }
  }

  selecionarPorId(id: string): Promise<RefRegistro | undefined> {
    return repositorioCategorias.selecionarPorId(id);
  }

  selecionarTodos(): Promise<SelectCategoriaSchema[]> {
    return repositorioCategorias.selecionarTodos();
  }

  // TODO: validar UUID
  async excluirPorId(id: string): Promise<boolean> {
    const atualizacoes = await repositorioCategorias.excluirPorId(id);
    return atualizacoes > 0;
  }

  async contar(): Promise<number | undefined> {
    const res = await repositorioCategorias.contar();
    return res ? res.count : undefined;
  }
}

const servicoCategorias = new ServicoCategorias();

export default servicoCategorias;
