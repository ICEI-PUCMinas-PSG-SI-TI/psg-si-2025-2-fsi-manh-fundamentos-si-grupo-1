import { debug } from "../logging";
import { RepositorioProdutos } from "../repository/repositorioProdutos";
import type { InsertProdutosSchema } from "../db/schema/produtos";
import { HttpError } from "../error";
import type { UuidResult } from "../api/v1/objects";

const repositorioProdutos = new RepositorioProdutos();

export class ServicoProdutos {
  async inserir(produto: InsertProdutosSchema): Promise<UuidResult> {
    const res = await repositorioProdutos.inserir(produto);
    if (res.length !== 1 || !res[0]) throw new HttpError("", 500);
    debug(`Novo produto criada!`, { label: "ServProdutos" });
    return res[0];
  }

  async selecionarPorId(id: string) {
    const res = await repositorioProdutos.selecionarPorId(id);
    if (res.length === 0) return null;
    return res[0]!;
  }

  selecionarTodos() {
    return repositorioProdutos.selecionarTodos(0, 0);
  }

  // NOTE: Utilizar com cuidado, atualmente utilizado apenas para faker.js
  selecionarIdTodos() {
    return repositorioProdutos.selecionarIdTodos();
  }

  async contar() {
    const res = await repositorioProdutos.contar();
    if (!res[0]) return 0;
    return res[0].count;
  }
}

const servicoProdutos = new ServicoProdutos();

export default servicoProdutos;
