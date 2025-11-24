/* eslint-disable camelcase */
import { Permissoes } from "../db/enums/permissoes";
// import { StatusProduto } from "../db/enums/produtos";
import { StatusProduto } from "../db/enums/statusProduto";
import { geradorCodigo } from "../db/geradorCodigos";
import type { InsertProdutosSchema } from "../db/schema/produtos";
import { HttpError } from "../error";
import { warning } from "../logging";
import repositorioCategorias from "../repository/repositorioCategorias";
import repositorioLotes from "../repository/repositorioLotes";
import repositorioPermissoes from "../repository/repositorioPermissoes";
import repositorioProdutos from "../repository/repositorioProdutos";
import repositorioMovimentacoes from "../repository/repositorioTransacoes";
import repositorioUnidadesMedida from "../repository/repositorioUnidadesMedida";
import repositorioUsuarios from "../repository/repositorioUsuarios";
import servicoCategorias from "./servicoCategorias";
import servicoLotes from "./servicoLotes";
import servicoProdutos from "./servicoProdutos";
import servicoUnidadesMedida from "./servicoUnidadesMedida";
import servicoUsuarios, { hashSenha } from "./servicoUsuarios";
import { faker, fakerPT_BR } from "@faker-js/faker";

function fakerLocal(): string {
  return `Andar ${faker.number.int({ min: 1, max: 10 })}`;
}

function fakerLote(): string {
  return faker.string.alphanumeric({ casing: "upper", length: 12 });
}

function fakerDimensoes(): string {
  return [
    faker.number.int({ min: 1, max: 100 }),
    "cm x ",
    faker.number.int({ min: 1, max: 100 }),
    "cm x ",
    faker.number.int({ min: 1, max: 100 }),
    "cm",
  ].join("");
}

/*
function fakerImage() {
  // faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
  return faker.image.dataUri({ type: "svg-base64", width: 200, height: 200 });
}
*/

function escolherAleatorios<T>(quant: number, valores: T[]): T[] {
  const _filtro: T[] = [];
  if (valores.length === 0) {
    throw new Error();
  }
  for (let i = 0; i < quant; i++) {
    const n = faker.number.int({ min: 0, max: valores.length - 1 });
    _filtro.push(valores[n]!);
  }
  return _filtro;
}

// TODO: Utilizar repositorio diretamente
async function escolherUnidadesMedida(
  canRecurse: boolean,
  quant: number,
): Promise<{ id: string }[]> {
  let quantUnidades = await servicoUnidadesMedida.contar();
  if (quantUnidades === 0) {
    if (canRecurse) {
      await servicoFaker.criarUnidadesMedida(quant);
    } else {
      throw new HttpError("No relational data found", 400);
    }
  }
  quantUnidades = await servicoUnidadesMedida.contar();
  if (quantUnidades === 0) {
    throw new HttpError("Can't create relational data", 400);
  }
  const unidades = await servicoUnidadesMedida.selecionarIdTodos();
  if (!unidades || unidades.length === 0) {
    throw new HttpError("Can't retrieve relational data", 400);
  }
  return escolherAleatorios(quant, unidades);
}

async function escolherProdutos(
  canRecurse: boolean,
  quant: number,
): Promise<{ id: string }[]> {
  let quantProdutos = await servicoProdutos.contar();
  if (quantProdutos === 0) {
    if (canRecurse) {
      await servicoFaker.criarProdutos(quant, canRecurse);
    } else {
      throw new HttpError("No relational data found", 400);
    }
  }
  quantProdutos = await servicoProdutos.contar();
  if (quantProdutos === 0) {
    throw new HttpError("Can't create relational data", 400);
  }
  const produtosId = await servicoProdutos.selecionarIdTodos();
  if (!produtosId || produtosId.length === 0) {
    throw new HttpError("Can't retrieve relational data", 400);
  }
  return escolherAleatorios(quant, produtosId);
}

async function escolherUsuarios(
  canRecurse: boolean,
  quant: number,
): Promise<{ id: string }[]> {
  let quantUsuarios = await servicoUsuarios.contar();
  if (quantUsuarios === 0) {
    if (canRecurse) {
      await servicoFaker.criarUsuarios(quant);
    } else {
      throw new HttpError("No relational data found", 400);
    }
  }
  quantUsuarios = await servicoUsuarios.contar();
  if (quantUsuarios === 0) {
    throw new HttpError("Can't create relational data", 400);
  }
  const usuariosId = await servicoUsuarios.selecionarIdTodos();
  if (!usuariosId || usuariosId.length === 0) {
    throw new HttpError("Can't retrieve relational data", 400);
  }
  return escolherAleatorios(quant, usuariosId);
}

async function escolherLotes(
  canRecurse: boolean,
  quant: number,
): Promise<{ id: string; produtoId: string }[]> {
  let quantLotes = await servicoLotes.contar();
  if (quantLotes === 0) {
    if (canRecurse) {
      await servicoFaker.criarLotes(quant, canRecurse);
    } else {
      throw new HttpError("No relational data found", 400);
    }
  }
  quantLotes = await servicoLotes.contar();
  if (quantLotes === 0) {
    throw new HttpError("Can't create relational data", 400);
  }
  const lotes = await repositorioLotes.selecionarIdProdutosTodos();
  if (!lotes || lotes.length === 0) {
    throw new HttpError("Can't retrieve relational data", 400);
  }
  return escolherAleatorios(quant, lotes);
}

async function escolherCategorias(
  canRecurse: boolean,
  quant: number,
): Promise<{ id: string }[]> {
  let quantCategorias = await servicoCategorias.contar();
  if (quantCategorias === 0) {
    if (canRecurse) {
      await servicoFaker.criarCategorias(quant);
    } else {
      throw new HttpError("No relational data found", 400);
    }
  }
  quantCategorias = await servicoCategorias.contar();
  if (quantCategorias === 0) {
    throw new HttpError("Can't create relational data", 400);
  }
  const categorias = await servicoCategorias.selecionarTodos();
  if (!categorias || categorias.length === 0) {
    throw new HttpError("Can't retrieve relational data", 400);
  }
  return escolherAleatorios(quant, categorias);
}

export class ServicoFaker {
  async criarProdutos(quant: number, canRecurse: boolean): Promise<void> {
    const unidades = await escolherUnidadesMedida(canRecurse, quant);
    if (!unidades || !unidades.length) {
      throw new Error();
    }

    const categorias = await escolherCategorias(canRecurse, quant);
    if (!categorias || !categorias.length) {
      throw new Error();
    }

    const produtos: InsertProdutosSchema[] = [];
    for (let i = 0; i < quant; i++) {
      produtos.push({
        nome: fakerPT_BR.commerce.product(),
        sku: fakerLote(),
        codigoBarra: fakerLote(),
        descricao: fakerPT_BR.commerce.productDescription(),
        categoriaId: categorias[i]!.id,
        marca: fakerPT_BR.company.name(),
        fornecedor: fakerPT_BR.company.name(),
        dimensoes: fakerDimensoes(),
        peso: faker.number.int({ min: 10000, max: 1000000 }),
        precoCusto: faker.number.int({ min: 10000, max: 10000000 }),
        precoVenda: faker.number.int({ min: 10000, max: 10000000 }),
        precoPromocao: faker.number.int({ min: 10000, max: 10000000 }),
        quantidadeUnidadeMedida: unidades[i]!.id,
        quantidadeMinima: faker.number.int({ min: 10000, max: 100000 }),
        quantidadeMaxima: faker.number.int({ min: 100001, max: 10000000 }),
        localizacao: fakerLocal(),
        // imagem: fakerImage(),
        status: StatusProduto.Ativo,
        codigo: geradorCodigo(),
      });
    }

    await repositorioProdutos.inserir(...produtos);
    warning(`Criado ${quant} produtos.`, { label: "Faker" });
  }

  async criarLotes(quant: number, canRecurse: boolean): Promise<void> {
    const produtos = await escolherProdutos(canRecurse, quant);
    if (!produtos || !produtos.length) {
      throw new Error();
    }

    const lotes = [];
    for (let i = 0; i < quant; i++) {
      lotes.push({
        produtoId: produtos[i]!.id,
        codigo: fakerLote(),
        quantidade: faker.number.int({ min: 1000, max: 10000000 }),
        validade: faker.date.future({ years: 1 }),
      });
    }

    await repositorioLotes.inserir(...lotes);
    warning(`Criado ${quant} lotes.`, { label: "Faker" });
  }

  async criarTransacoes(quant: number, canRecurse: boolean): Promise<void> {
    const lotes = await escolherLotes(canRecurse, quant);
    if (!lotes || !lotes.length) {
      throw new Error();
    }

    const usuarios = await escolherUsuarios(canRecurse, quant);
    if (!usuarios || !usuarios.length) {
      throw new Error();
    }

    const movimentacoes = [];
    for (let i = 0; i < quant; i++) {
      movimentacoes.push({
        // TODO: invalidar campo produto (já possui lote)?
        produtoId: lotes[i]!.produtoId,
        usuarioId: usuarios[i]!.id,
        loteId: lotes[i]!.id,
        quantidade: faker.number.int({ min: 100000, max: 1000000 }),
        horario: faker.date.past({ years: 1 }),
        localOrigem: fakerLocal(),
        localDestino: fakerLocal(),
        observacao: faker.lorem.paragraph(2),
        motivo: faker.number.int({ min: 0, max: 9 }).toString(),
      });
    }

    await repositorioMovimentacoes.inserir(...movimentacoes);
    warning(`Criado ${quant} transações.`, { label: "Faker" });
  }

  async criarUsuarios(quant: number): Promise<void> {
    const usuarios = [];
    for (let i = 0; i < quant; i++) {
      const hashedPassword = await hashSenha(
        faker.string.hexadecimal({ length: 32 }),
      );
      usuarios.push({
        nome: faker.person.fullName(),
        login: faker.internet.username(),
        hashedPassword,
        descricao: faker.person.jobDescriptor(),
        habilitado: faker.datatype.boolean(),
        modoEscuro: faker.datatype.boolean(),
        // foto: fakerImage(),
      });
    }

    const usuarioIds = await repositorioUsuarios.inserir(...usuarios);
    const permissoes = usuarioIds.map((u) => ({
      usuarioId: u.id,
      cargo: Permissoes.Operacional,
    }));
    await repositorioPermissoes.inserir(...permissoes);
    warning(`Criado ${quant} usuários.`, { label: "Faker" });
  }

  async criarUnidadesMedida(quant: number): Promise<void> {
    const unidadesMedida = [];
    for (let i = 0; i < quant; i++) {
      const unit = faker.science.unit();
      unidadesMedida.push({
        nome: unit.name,
        abreviacao: unit.symbol,
      });
    }

    await repositorioUnidadesMedida.inserirIgnorandoDuplicatas(
      ...unidadesMedida,
    );
    warning(`Criado ${quant} unidades de medida.`, { label: "Faker" });
  }

  async criarCategorias(quant: number): Promise<void> {
    const categorias = [];
    for (let i = 0; i < quant; i++) {
      categorias.push({
        nome: fakerPT_BR.commerce.department(),
      });
    }

    await repositorioCategorias.inserirIgnorandoDuplicatas(...categorias);
    warning(`Criado ${quant} categorias.`, { label: "Faker" });
  }
}

const servicoFaker = new ServicoFaker();

export default servicoFaker;
