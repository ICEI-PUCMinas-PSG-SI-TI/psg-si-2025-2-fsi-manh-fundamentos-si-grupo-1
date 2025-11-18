import { debug } from "../logging";
import { RepositorioProdutos } from "../repository/repositorioProdutos";
import {
  InsertProdutosSchemaZ,
  type InsertProdutosSchema,
  type SelectProdutosSchema,
} from "../db/schema/produtos";
import { HttpError } from "../error";
import * as z4 from "zod/v4";
import type { RefRegistro } from "../repository/common";

const repositorioProdutos = new RepositorioProdutos();

export const ParamsInserirProdutosZ = InsertProdutosSchemaZ.pick({
  nome: true,
  sku: true,
  codigoBarra: true,
  descricao: true,
  categoria: true,
  marca: true,
  fornecedor: true,
  dimensoes: true,
  peso: true,
  precoCusto: true,
  precoVenda: true,
  precoPromocao: true,
  quantidadeMinima: true,
  quantidadeMaxima: true,
  localizacao: true,
  imagem: true,
  quantidadeUnidadeMedida: true,
  status: true,
}).strict();

export type ParamsInserirProdutos = z4.infer<typeof ParamsInserirProdutosZ>;

export const ParamsConsultaProdutosZ = z4.strictObject({
  id: z4.uuid().optional(),
  pagina: z4.coerce.number().int().gt(0).optional(),
  paginaTamanho: z4.coerce.number().int().gt(0).optional(),
  precoCustoMin: z4.coerce.number().int().gt(0).optional(),
  precoCustoMax: z4.coerce.number().int().gt(0).optional(),
  precoVendaMin: z4.coerce.number().int().gt(0).optional(),
  precoVendaMax: z4.coerce.number().int().gt(0).optional(),
  precoPromocaoMin: z4.coerce.number().int().gt(0).optional(),
  precoPromocaoMax: z4.coerce.number().int().gt(0).optional(),
  pesoMin: z4.coerce.number().int().gt(0).optional(),
  pesoMax: z4.coerce.number().int().gt(0).optional(),
  texto: z4.string().min(1).optional(),
  categoria: z4.uuid().optional(),
});

export type ParamsConsultaProdutos = z4.infer<typeof ParamsConsultaProdutosZ>;

export class ServicoProdutos {
  /* TODO: Inserir todos os valores de uma vez, retornar uuid
  async inserir(produto: InsertProdutosSchema): Promise<UuidResult> {
    // TODO;
  }
  */

  async inserir(produto: InsertProdutosSchema): Promise<RefRegistro> {
    const res = await repositorioProdutos.inserir(produto);
    if (res.length !== 1 || !res[0]) throw new HttpError("", 500);
    debug(`Novo produto criada!`, { label: "ServProdutos" });
    return res[0];
  }

  async selecionarPorId(id: string): Promise<SelectProdutosSchema | null> {
    const res = await repositorioProdutos.selecionarPorId(id);
    if (res) {
      return res;
    } else {
      return null;
    }
  }

  // TODO: reformular função ou adicionar tipagem correta
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async selecionarConsulta(opts: ParamsConsultaProdutos) {
    let query = repositorioProdutos.selecionarQueryComLotes();
    if (opts) {
      if (opts.id) {
        query = query.comId(opts.id);
      }
      query = query.comPaginacao(opts.pagina, opts.paginaTamanho);
      if (opts.precoCustoMin) {
        query = query.comPrecoCustoMaiorIgualQue(opts.precoCustoMin);
      }
      if (opts.precoCustoMax) {
        query = query.comPrecoCustoMenorIgualQue(opts.precoCustoMax);
      }
      if (opts.precoVendaMin) {
        query = query.comPrecoVendaMaiorIgualQue(opts.precoVendaMin);
      }
      if (opts.precoVendaMax) {
        query = query.comPrecoVendaMenorIgualQue(opts.precoVendaMax);
      }
      if (opts.precoPromocaoMin) {
        query = query.comPrecoPromocaoMaiorIgualQue(opts.precoPromocaoMin);
      }
      if (opts.precoPromocaoMax) {
        query = query.comPrecoPromocaoMenorIgualQue(opts.precoPromocaoMax);
      }
      if (opts.pesoMin) {
        query = query.comPesoMaiorIgualQue(opts.pesoMin);
      }
      if (opts.pesoMax) {
        query = query.comPesoMenorIgualQue(opts.pesoMax);
      }
      if (opts.categoria) {
        query = query.comCategoria(opts.categoria);
      }
      if (opts.texto) {
        query = query.comTexto(opts.texto);
      }
    }
    const res = await query.executarConsulta();
    return res;
  }

  selecionarTodos(): Promise<SelectProdutosSchema[]> {
    return repositorioProdutos.selecionarTodos();
  }

  // NOTE: Utilizar com cuidado, atualmente utilizado apenas para faker.js
  selecionarIdTodos(): Promise<RefRegistro[]> {
    return repositorioProdutos.selecionarIdsTodos();
  }

  async contar(): Promise<number | undefined> {
    const res = await repositorioProdutos.contar();
    return res ? res.count : undefined;
  }
}

const servicoProdutos = new ServicoProdutos();

export default servicoProdutos;
