import { sql, type InferSelectModel } from "drizzle-orm";
import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as genUUID } from "uuid";
import * as z4 from "zod/v4";
import { tabelaUnidadesMedida } from "./unidadesMedida";
import { tabelaCategorias } from "./categorias";

export enum StatusProduto {
  Ativo = "ATIVO",
  Inativo = "INATIVO",
  Descontinuado = "DESCONTINUADO",
  Bloqueado = "BLOQUEADO",
}

export const tabelaProdutos = sqliteTable("produtos", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  nome: text().notNull().default("Novo produto"),
  sku: text(),
  codigoBarra: text("codigo_barra"),
  descricao: text(),
  // TODO: Futuramente criar uma outra tabela de relação produto x categoria e
  // remover campo
  categoria: text(),
  categoriaId: text().references(() => tabelaCategorias.id),
  marca: text(),
  fornecedor: text(),
  dimensoes: text(),
  peso: int(),
  precoCusto: int("preco_custo"),
  precoVenda: int("preco_venda"),
  precoPromocao: int("preco_promocao"),
  quantidadeUnidadeMedida: text("quantidade_unidade_medida")
    .notNull()
    .references(() => tabelaUnidadesMedida.id),
  quantidadeMinima: int("quantidade_minima"),
  quantidadeMaxima: int("quantidade_maxima"),
  localizacao: text(),
  imagem: blob(),
  status: text({
    // TODO: use ENUM_PRODUTOS_STATUS
    enum: [
      StatusProduto.Ativo,
      StatusProduto.Inativo,
      StatusProduto.Descontinuado,
      StatusProduto.Bloqueado,
    ],
  }).notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch()*1000)`),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch()*1000)`),
});

// Campos da tabela que podem ser atualizados. Os campos não são inferidos
// diretamente para evitar a permissão de edição de futuros campos que podem
// ser adicionados a tabela.
export const UpdateProdutosSchemaZ = z4.strictObject({
  nome: z4.string().optional(),
  sku: z4.string().optional(),
  codigoBarra: z4.string().optional(),
  descricao: z4.string().optional(),
  categoria: z4.string().optional(),
  marca: z4.string().optional(),
  fornecedor: z4.string().optional(),
  dimensoes: z4.string().optional(),
  peso: z4.int().optional(),
  precoCusto: z4.int().optional(),
  precoVenda: z4.int().optional(),
  precoPromocao: z4.int().optional(),
  // quantidadeUnidadeMedida: z4.string().optional(),
  quantidadeMinima: z4.int().optional(),
  quantidadeMaxima: z4.int().optional(),
  localizacao: z4.string().optional(),
  imagem: z4.base64().optional(),
  status: z4.enum([
    StatusProduto.Ativo,
    StatusProduto.Inativo,
    StatusProduto.Descontinuado,
    StatusProduto.Bloqueado,
  ]),
});

// Os campos de inserção podem ser inferidos. Alguns deles podem ser adicionalmente validados como UUID e omitidos.
export const InsertProdutosSchemaZ = createInsertSchema(tabelaProdutos, {
  id: z4.uuid().optional(),
  imagem: z4.base64().optional(),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict();

export type SelectProdutosSchema = InferSelectModel<typeof tabelaProdutos>;
export type UpdateProdutosSchema = z4.infer<typeof UpdateProdutosSchemaZ>;
export type InsertProdutosSchema = z4.infer<typeof InsertProdutosSchemaZ>;
