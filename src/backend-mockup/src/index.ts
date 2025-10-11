import { faker, fakerPT_BR } from "@faker-js/faker";
import {
  fakerCNPJ,
  fakerCPF,
  fakerDimensoes,
  fakerEndereco,
  fakerImageURL,
  fakerIntBoolean,
  fakerLocal,
  fakerLote,
} from "./custom-types";
import { exportFile } from "./export-file";

function criarCategoria() {
  return {
    id: faker.string.uuid(),
    categoria: faker.commerce.department(),
  };
}

function criarConfiguracoes() {
  return {
    id: faker.string.uuid(),
    nome: faker.company.name(),
    cnpj: fakerCNPJ(true),
    endereco: fakerEndereco(),
  };
}

function criarLotes() {
  return {
    id: faker.string.uuid(),
    produto_id: faker.string.uuid(),
    lote: fakerLote(),
    quantidade: faker.number.int({ min: 1000, max: 10000000 }),
    validade: faker.date.future({ years: 1 }).toISOString().slice(0, 10),
  };
}

function criarProdutos() {
  return {
    id: faker.string.uuid(),
    nome: fakerPT_BR.commerce.product(),
    sku: fakerLote(),
    codigo_barra: fakerLote(),
    descricao: fakerPT_BR.commerce.productDescription(),
    categoria: fakerPT_BR.commerce.department(),
    marca: fakerPT_BR.company.name(),
    fornecedor: fakerPT_BR.company.name(),
    dimensoes: fakerDimensoes(),
    peso: faker.number.int({ min: 10000, max: 1000000 }),
    preco_custo: faker.number.int({ min: 10000, max: 10000000 }),
    preco_venda: faker.number.int({ min: 10000, max: 10000000 }),
    preco_promocao: faker.number.int({ min: 10000, max: 10000000 }),
    quantidade_unidade_medida: fakerPT_BR.science.unit().name,
    quantidade_minima: faker.number.int({ min: 10000, max: 100000 }),
    quantidade_maxima: faker.number.int({ min: 100001, max: 10000000 }),
    localizacao: fakerLocal(),
    imagem: fakerImageURL(),
    status: faker.number.int({ min: 0, max: 3 }),
  };
}

function criarSecoes() {
  return {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    token: faker.internet.jwt(),
    user_agent: faker.internet.userAgent(),
    ip: faker.internet.ip(),
    created_at: faker.date.past({ years: 1 }),
  };
}

function criarTransacoes() {
  return {
    id: faker.string.uuid(),
    produto_id: faker.string.uuid(),
    usuario_id: faker.string.uuid(),
    lote_id: faker.string.uuid(),
    tipo: faker.number.int({ min: 0, max: 9 }),
    quantidade: faker.number.int({ min: 100000, max: 1000000 }),
    data_hora: faker.date.past({ years: 1 }),
    local_origem_id: fakerLocal(),
    local_destino_id: fakerLocal(),
    // "referencia_externa_id": faker.string.uuid(),
    observacao: faker.lorem.paragraph(2),
    // "saldo_anterior": ,
    // "saldo_posterior":,
  };
}

function criarUnidadesMedidas() {
  const unit = faker.science.unit();
  return {
    id: faker.string.uuid(),
    nome: unit.name,
    abreviacao: unit.symbol,
  };
}

function criarUsuarios() {
  return {
    id: faker.string.uuid(),
    nome: faker.person.fullName(),
    login: faker.internet.username(),
    email: faker.internet.email(),
    salted_password: faker.string.hexadecimal({ length: 32 }),
    identificacao: fakerCPF(),
    cargo: faker.person.jobTitle(),
    descricao: faker.person.jobDescriptor(),
    habilitado: fakerIntBoolean(),
    modo_escuro: fakerIntBoolean(),
    nivel_permissoes: faker.number.int({ min: 0, max: 3 }),
    foto: fakerImageURL(),
    criado_em: faker.date.past({ years: 1 }),
    criado_por: faker.string.uuid(),
  };
}

function repeatCall(callack: () => {}, number: number = 10) {
  let obj: {}[] = [];
  for (let index = 0; index < number; index++) {
    obj.push(callack());
  }
  return obj;
}

exportFile(
  {
    categorias: repeatCall(criarCategoria, 10),
    configuracoes: repeatCall(criarConfiguracoes, 10),
    lotes: repeatCall(criarLotes, 10),
    produtos: repeatCall(criarProdutos, 10),
    secoes: repeatCall(criarSecoes, 10),
    transacoes: repeatCall(criarTransacoes, 10),
    unidades_medida: repeatCall(criarUnidadesMedidas, 10),
    usuarios: repeatCall(criarUsuarios, 10),
  },
  "./mockup.json"
);
