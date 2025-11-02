import { debug } from "../logging";
import { RepositorioProdutos } from "../repository/repositorioProdutos";
import type { InsertProdutosSchema } from "../db/schema/produtos";

const repositorioProdutos = new RepositorioProdutos();

export class ServicoProdutos {
  async inserir(produto: InsertProdutosSchema) {
    const res = await repositorioProdutos.inserir(produto);
    if (res && res > 0) {
      debug(`Novo produto criada!`, { label: "ServProdutos" });
    }
    return res;
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
