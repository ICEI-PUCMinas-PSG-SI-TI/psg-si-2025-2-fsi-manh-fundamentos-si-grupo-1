import { sql, type InferSelectModel } from "drizzle-orm";
import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as genUUID } from "uuid";
import z from "zod";
import { unidadesMedidaTable } from "./unidadesMedida";

export const produtosTable = sqliteTable("produtos", {
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
  marca: text(),
  fornecedor: text(),
  dimensoes: text(),
  peso: int(),
  precoCusto: int("preco_custo"),
  precoVenda: int("preco_venda"),
  precoPromocao: int("preco_promocao"),
  quantidadeUnidadeMedida: text("quantidade_unidade_medida")
    .notNull()
    .references(() => unidadesMedidaTable.id),
  quantidadeMinima: int("quantidade_minima"),
  quantidadeMaxima: int("quantidade_maxima"),
  localizacao: text(),
  imagem: blob(),
  status: text({
    // TODO: use ENUM_PRODUTOS_STATUS
    enum: ["ATIVO", "INATIVO", "DESCONTINUADO", "BLOQUEADO"],
  }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Campos da tabela que podem ser atualizados. Os campos não são inferidos
// diretamente para evitar a permissão de edição de futuros campos que podem
// ser adicionados a tabela.
export const UpdateProdutosSchemaZ = z.strictObject({
  nome: z.string().optional(),
  sku: z.string().optional(),
  codigoBarra: z.string().optional(),
  descricao: z.string().optional(),
  categoria: z.string().optional(),
  marca: z.string().optional(),
  fornecedor: z.string().optional(),
  dimensoes: z.string().optional(),
  peso: z.int().optional(),
  precoCusto: z.int().optional(),
  precoVenda: z.int().optional(),
  precoPromocao: z.int().optional(),
  // quantidadeUnidadeMedida: z.string().optional(),
  quantidadeMinima: z.int().optional(),
  quantidadeMaxima: z.int().optional(),
  localizacao: z.string().optional(),
  imagem: z.base64().optional(),
  status: z.enum(["ATIVO", "INATIVO", "DESCONTINUADO", "BLOQUEADO"]),
});

// Os campos de inserção podem ser inferidos. Alguns deles podem ser adicionalmente validados como UUID e omitidos.
export const InsertProdutosSchemaZ = createInsertSchema(produtosTable, {
  id: z.uuid().optional(),
  imagem: z.base64().optional(),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict();

export type SelectProdutosSchema = InferSelectModel<typeof produtosTable>;
export type UpdateProdutosSchema = z.infer<typeof UpdateProdutosSchemaZ>;
export type InsertProdutosSchema = z.infer<typeof InsertProdutosSchemaZ>;
