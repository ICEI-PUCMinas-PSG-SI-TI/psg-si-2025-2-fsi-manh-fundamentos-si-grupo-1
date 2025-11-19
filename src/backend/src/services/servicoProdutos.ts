import type { Identificador } from "../db/enums/identificador";
import { configurarGerador, geradorCodigo } from "../db/geradorCodigos";
import {
  type InsertProdutosSchema,
  InsertProdutosSchemaZ,
  type SelectProdutosSchema,
} from "../db/schema/produtos";
import { HttpError } from "../error";
import { debug } from "../logging";
import type { RefRegistro } from "../repository/common";
import {
  type RepoConsultaParamsProdutoQuantidade,
  RepositorioProdutos,
} from "../repository/repositorioProdutos";
import * as z4 from "zod/v4";

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
    produto.codigo = geradorCodigo();
    const res = await repositorioProdutos.inserir(produto);
    if (res.length !== 1 || !res[0]) {
      throw new HttpError("", 500);
    }
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

  // HACK: Criar DTO para essa função
  // TODO: Criar DTO para essa função
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  selecionarConsulta(opts?: ParamsConsultaProdutos) {
    const filtros = {
      comId: opts?.id,
      comCategoria: opts?.categoria,
      comTexto: opts?.texto,
      comPrecoCustoMaiorIgualQue: opts?.precoCustoMin,
      comPrecoCustoMenorIgualQue: opts?.precoCustoMax,
      comPrecoVendaMaiorIgualQue: opts?.precoVendaMin,
      comPrecoVendaMenorIgualQue: opts?.precoVendaMax,
      comPrecoPromocaoMaiorIgualQue: opts?.precoPromocaoMin,
      comPrecoPromocaoMenorIgualQue: opts?.precoPromocaoMax,
      comPesoMaiorIgualQue: opts?.pesoMin,
      comPesoMenorIgualQue: opts?.pesoMax,
    } as RepoConsultaParamsProdutoQuantidade;

    if (opts?.pagina && opts?.paginaTamanho) {
      filtros.pagina = opts?.pagina;
      filtros.paginaTamanho = opts?.paginaTamanho;
    }

    const query = repositorioProdutos.selecionarConsultaComQuantidade(filtros);
    return query;
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

  // TODO: Otimizar
  async alterarFormatoCodigo(identificador: Identificador): Promise<void> {
    // TODO: Verificar se o código é o mesmo.
    configurarGerador(identificador);
    const res = await repositorioProdutos.contar();
    if (!res) {
      throw new Error();
    }
    if (res.count === 0) {
      return;
    }
    const idList = await repositorioProdutos.selecionarIdsTodos();
    const atualiacoes = idList.map((u) => {
      return {
        id: u.id,
        codigo: geradorCodigo(),
      };
    });
    await repositorioProdutos.iniciarTransacao(async (tx) => {
      const atualizacoes = atualiacoes.map((x) => {
        return repositorioProdutos.atualizarPorIdTransaction(
          x.id,
          {
            codigo: x.codigo,
          },
          tx,
        );
      });
      return await Promise.all(atualizacoes);
    });
  }
}

const servicoProdutos = new ServicoProdutos();

export default servicoProdutos;
