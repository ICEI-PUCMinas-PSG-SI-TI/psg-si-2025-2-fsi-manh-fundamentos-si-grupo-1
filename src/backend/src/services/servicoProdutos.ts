import * as z4 from "zod/v4";
import type { Identificador } from "../db/enums/identificador";
import { StatusProduto } from "../db/enums/statusProduto";
import { configurarGerador, geradorCodigo } from "../db/geradorCodigos";
import { HttpError } from "../error";
import { z4Base64File } from "../helpers";
import { debug } from "../logging";
import repositorioProdutos, {
  type RepoConsultaParamsProdutoQuantidade,
} from "../repository/repositorioProdutos";

export const SetProdutoDtoZ = z4.object({
  nome: z4.string(),
  codigo: z4.string().optional(),
  sku: z4.string().nullish(),
  codigoBarra: z4.string().nullish(),
  descricao: z4.string().nullish(),
  categoriaId: z4.uuid().nullish(),
  marca: z4.string().nullish(),
  fornecedor: z4.string().nullish(),
  dimensoes: z4.string().nullish(),
  peso: z4.number().nullish(),
  precoCusto: z4.number().nullish(),
  precoVenda: z4.number().nullish(),
  precoPromocao: z4.number().nullish(),
  unidadeMedidaId: z4.uuid().nullish(),
  quantidadeMinima: z4.number().nullish(),
  quantidadeMaxima: z4.number().nullish(),
  localizacao: z4.string().nullish(),
  imagem: z4Base64File.optional(),
  status: z4.enum(StatusProduto),
});

export type SetProdutoDto = z4.infer<typeof SetProdutoDtoZ>;

export const GetProdutoDtoZ = z4.object({
  id: z4.uuid(),
  nome: z4.string(),
  codigo: z4.string(),
  sku: z4.string().nullable(),
  codigoBarra: z4.string().nullable(),
  descricao: z4.string().nullable(),
  categoriaId: z4.uuid().nullable(),
  marca: z4.string().nullable(),
  fornecedor: z4.string().nullable(),
  dimensoes: z4.string().nullable(),
  peso: z4.number().nullable(),
  precoCusto: z4.number().nullable(),
  precoVenda: z4.number().nullable(),
  precoPromocao: z4.number().nullable(),
  unidadeMedidaId: z4.uuid().nullable(),
  quantidadeMinima: z4.number().nullable(),
  quantidadeMaxima: z4.number().nullable(),
  localizacao: z4.string().nullable(),
  imagem: z4Base64File.optional(),
  status: z4.enum(StatusProduto),
});

export type GetProdutoDto = z4.infer<typeof GetProdutoDtoZ>;

export const GetConsultaProdutoDtoZ = GetProdutoDtoZ.extend({
  categoria: z4.string().nullable().optional(),
  quantidade: z4.number().nullable().optional(),
});

export type GetConsultaProdutoDto = z4.infer<typeof GetConsultaProdutoDtoZ>;

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
  categoriaId: z4.uuid().optional(),
});

export type ParamsConsultaProdutos = z4.infer<typeof ParamsConsultaProdutosZ>;

class ServicoProdutos {
  async inserir(produto: SetProdutoDto): Promise<string> {
    produto.codigo = geradorCodigo();
    const res = await repositorioProdutos.inserir({
      ...produto,
      codigo: geradorCodigo(),
    });
    if (res.length !== 1 || !res[0]) {
      throw new HttpError("", 500);
    }
    debug(`Novo produto criada!`, { label: "ServProdutos" });
    return res[0].id;
  }

  async selecionarPorId(id: string): Promise<GetProdutoDto | null> {
    const registro = await repositorioProdutos.selecionarPorId(id);
    if (registro) {
      return {
        id: registro.id,
        nome: registro.nome,
        codigo: registro.codigo,
        sku: registro.sku,
        codigoBarra: registro.codigoBarra,
        descricao: registro.descricao,
        // TODO: map() categoriaId -> Nome Categoria
        categoriaId: registro.categoriaId,
        marca: registro.marca,
        fornecedor: registro.fornecedor,
        dimensoes: registro.dimensoes,
        peso: registro.peso,
        precoCusto: registro.precoCusto,
        precoVenda: registro.precoVenda,
        precoPromocao: registro.precoPromocao,
        quantidadeMinima: registro.quantidadeMinima,
        quantidadeMaxima: registro.quantidadeMaxima,
        localizacao: registro.localizacao,
        imagem: registro.imagem as string,
        status: registro.status,
        unidadeMedidaId: registro.unidadeMedidaId,
      };
    } else {
      return null;
    }
  }

  async selecionarConsulta(
    opts?: ParamsConsultaProdutos,
  ): Promise<GetConsultaProdutoDto[]> {
    const filtros = {
      comId: opts?.id,
      comCategoriaId: opts?.categoriaId,
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

    const registros =
      await repositorioProdutos.selecionarConsultaCompleta(filtros);
    return registros.map((registro) => ({
      id: registro.id,
      nome: registro.nome,
      codigo: registro.codigo,
      sku: registro.sku,
      codigoBarra: registro.codigoBarra,
      descricao: registro.descricao,
      // TODO: map() categoriaId -> Nome Categoria
      categoriaId: registro.categoriaId,
      marca: registro.marca,
      fornecedor: registro.fornecedor,
      dimensoes: registro.dimensoes,
      peso: registro.peso,
      precoCusto: registro.precoCusto,
      precoVenda: registro.precoVenda,
      precoPromocao: registro.precoPromocao,
      quantidadeMinima: registro.quantidadeMinima,
      quantidadeMaxima: registro.quantidadeMaxima,
      localizacao: registro.localizacao,
      imagem: registro.imagem as string,
      status: registro.status,
      unidadeMedidaId: registro.unidadeMedidaId,
      quantidade: registro.quantidade,
      categoria: registro.categoria,
    }));
  }

  async selecionarTodos(): Promise<GetProdutoDto[]> {
    const registros = await repositorioProdutos.selecionarTodos();
    return registros.map((registro) => ({
      id: registro.id,
      nome: registro.nome,
      codigo: registro.codigo,
      sku: registro.sku,
      codigoBarra: registro.codigoBarra,
      descricao: registro.descricao,
      // TODO: map() categoriaId -> Nome Categoria
      categoriaId: registro.categoriaId,
      marca: registro.marca,
      fornecedor: registro.fornecedor,
      dimensoes: registro.dimensoes,
      peso: registro.peso,
      precoCusto: registro.precoCusto,
      precoVenda: registro.precoVenda,
      precoPromocao: registro.precoPromocao,
      quantidadeMinima: registro.quantidadeMinima,
      quantidadeMaxima: registro.quantidadeMaxima,
      localizacao: registro.localizacao,
      imagem: registro.imagem as string,
      status: registro.status,
      unidadeMedidaId: registro.unidadeMedidaId,
    }));
  }

  // NOTE: Utilizar com cuidado, atualmente utilizado apenas para faker.js
  async listarIds(): Promise<string[]> {
    const registros = await repositorioProdutos.selecionarIdsTodos();
    return registros.map((registro) => registro.id);
  }

  async contar(): Promise<number> {
    const res = await repositorioProdutos.contar();
    return res!.count;
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
    const novosIds = idList.map((u) => {
      return {
        id: u.id,
        novoCodigo: geradorCodigo(),
      };
    });
    await repositorioProdutos.utilizarTransacao(async (tx) => {
      const atualizacoes = novosIds.map((registro) => {
        return repositorioProdutos.atualizarPorIdTransacao(tx, registro.id, {
          codigo: registro.novoCodigo,
        });
      });
      return await Promise.all(atualizacoes);
    });
  }
}

const servicoProdutos = new ServicoProdutos();

export default servicoProdutos;
