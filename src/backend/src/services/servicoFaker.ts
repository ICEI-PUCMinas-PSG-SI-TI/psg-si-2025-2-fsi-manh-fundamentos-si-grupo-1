/* eslint-disable camelcase */
import { faker, fakerPT_BR } from "@faker-js/faker";
import servicoLotes from "./servicoLotes";
import servicoProdutos from "./servicoProdutos";
import { HttpError } from "../error";
import servicoTransacoes from "./servicoTransacoes";
import servicoUsuarios from "./servicoUsuarios";
import servicoUnidadesMedida from "./servicoUnidadesMedida";
import { StatusProduto } from "../db/schema/produtos";
import { warning } from "../logging";
import servicoCategorias from "./servicoCategorias";

function fakerLocal() {
  return `Andar ${faker.number.int({ min: 1, max: 10 })}`;
}

function fakerLote() {
  return faker.string.alphanumeric({ casing: "upper", length: 12 });
}

function fakerDimensoes() {
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
  if (valores.length === 0) throw new Error();
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
    if (canRecurse) await servicoFaker.criarUnidadesMedida(quant);
    else throw new HttpError("No relational data found", 400);
  }
  quantUnidades = await servicoUnidadesMedida.contar();
  if (quantUnidades === 0)
    throw new HttpError("Can't create relational data", 400);
  const unidades = await servicoUnidadesMedida.selecionarIdTodos();
  if (!unidades || unidades.length === 0)
    throw new HttpError("Can't retrieve relational data", 400);
  return escolherAleatorios(quant, unidades);
}

async function escolherProdutos(
  canRecurse: boolean,
  quant: number,
): Promise<{ id: string }[]> {
  let quantProdutos = await servicoProdutos.contar();
  if (quantProdutos === 0) {
    if (canRecurse) await servicoFaker.criarProdutos(quant, canRecurse);
    else throw new HttpError("No relational data found", 400);
  }
  quantProdutos = await servicoProdutos.contar();
  if (quantProdutos === 0)
    throw new HttpError("Can't create relational data", 400);
  const produtosId = await servicoProdutos.selecionarIdTodos();
  if (!produtosId || produtosId.length === 0)
    throw new HttpError("Can't retrieve relational data", 400);
  return escolherAleatorios(quant, produtosId);
}

async function escolherUsuarios(
  canRecurse: boolean,
  quant: number,
): Promise<{ id: string }[]> {
  let quantUsuarios = await servicoUsuarios.contar();
  if (quantUsuarios === 0) {
    if (canRecurse) await servicoFaker.criarUsuarios(quant);
    else throw new HttpError("No relational data found", 400);
  }
  quantUsuarios = await servicoUsuarios.contar();
  if (quantUsuarios === 0)
    throw new HttpError("Can't create relational data", 400);
  const usuariosId = await servicoUsuarios.selecionarIdTodos();
  if (!usuariosId || usuariosId.length === 0)
    throw new HttpError("Can't retrieve relational data", 400);
  return escolherAleatorios(quant, usuariosId);
}

async function escolherLotes(
  canRecurse: boolean,
  quant: number,
): Promise<{ id: string; produtoId: string }[]> {
  let quantLotes = await servicoLotes.contar();
  if (quantLotes === 0) {
    if (canRecurse) await servicoFaker.criarLotes(quant, canRecurse);
    else throw new HttpError("No relational data found", 400);
  }
  quantLotes = await servicoLotes.contar();
  if (quantLotes === 0)
    throw new HttpError("Can't create relational data", 400);
  const lotes = await servicoLotes.selecionarIdProdutosTodos();
  if (!lotes || lotes.length === 0)
    throw new HttpError("Can't retrieve relational data", 400);
  return escolherAleatorios(quant, lotes);
}

async function escolherCategorias(
  canRecurse: boolean,
  quant: number,
): Promise<{ id: string }[]> {
  let quantCategorias = await servicoCategorias.contar();
  if (quantCategorias === 0) {
    if (canRecurse) await servicoFaker.criarCategorias(quant);
    else throw new HttpError("No relational data found", 400);
  }
  quantCategorias = await servicoCategorias.contar();
  if (quantCategorias === 0)
    throw new HttpError("Can't create relational data", 400);
  const categorias = await servicoCategorias.selecionarTodos();
  if (!categorias || categorias.length === 0)
    throw new HttpError("Can't retrieve relational data", 400);
  return escolherAleatorios(quant, categorias);
}

export class ServicoFaker {
  async criarProdutos(quant: number, canRecurse: boolean) {
    const unidades = await escolherUnidadesMedida(canRecurse, quant);
    if (!unidades || !unidades.length) throw new Error();

    const categorias = await escolherCategorias(canRecurse, quant);
    if (!categorias || !categorias.length) throw new Error();

    for (let i = 0; i < quant; i++) {
      await servicoProdutos.inserir({
        nome: fakerPT_BR.commerce.product(),
        sku: fakerLote(),
        codigoBarra: fakerLote(),
        descricao: fakerPT_BR.commerce.productDescription(),
        categoria: fakerPT_BR.commerce.department(),
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
      });
    }
    warning(`Criado ${quant} produtos.`, { label: "Faker" });
  }

  async criarLotes(quant: number, canRecurse: boolean) {
    const produtos = await escolherProdutos(canRecurse, quant);
    if (!produtos || !produtos.length) throw new Error();

    for (let i = 0; i < quant; i++) {
      const produto = produtos[i];
      if (!produto) throw new Error();
      await servicoLotes.inserir({
        produtoId: produto.id,
        codigo: fakerLote(),
        quantidade: faker.number.int({ min: 1000, max: 10000000 }),
        validade: faker.date.future({ years: 1 }),
      });
    }
    warning(`Criado ${quant} lotes.`, { label: "Faker" });
  }

  async criarTransacoes(quant: number, canRecurse: boolean) {
    const lotes = await escolherLotes(canRecurse, quant);
    if (!lotes || !lotes.length) throw new Error();

    const usuarios = await escolherUsuarios(canRecurse, quant);
    if (!usuarios || !usuarios.length) throw new Error();

    for (let i = 0; i < quant; i++) {
      await servicoTransacoes.inserir({
        // TODO: invalidar produto?
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
    warning(`Criado ${quant} transações.`, { label: "Faker" });
  }
  async criarUsuarios(quant: number) {
    for (let i = 0; i < quant; i++) {
      await servicoUsuarios.inserir({
        nome: faker.person.fullName(),
        login: faker.internet.username(),
        password: faker.string.hexadecimal({ length: 32 }),
        descricao: faker.person.jobDescriptor(),
        habilitado: faker.datatype.boolean(),
        // modoEscuro: faker.datatype.boolean(),
        nivelPermissoes: faker.number.int({ min: 0, max: 3 }),
        // foto: fakerImage(),
      });
    }
    warning(`Criado ${quant} usuários.`, { label: "Faker" });
  }

  async criarUnidadesMedida(quant: number) {
    for (let i = 0; i < quant; i++) {
      const unit = faker.science.unit();
      await servicoUnidadesMedida.inserir({
        nome: unit.name,
        abreviacao: unit.symbol,
      });
    }
    warning(`Criado ${quant} unidades de medida.`, { label: "Faker" });
  }

  async criarCategorias(quant: number) {
    for (let i = 0; i < quant; i++) {
      await servicoCategorias.inserir({
        nome: faker.commerce.department(),
      });
    }
    warning(`Criado ${quant} unidades de medida.`, { label: "Faker" });
  }
}

const servicoFaker = new ServicoFaker();

export default servicoFaker;
