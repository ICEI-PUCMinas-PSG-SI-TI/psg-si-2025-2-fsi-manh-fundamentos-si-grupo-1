import { StatusProduto } from "../enums/statusProduto";
import { tabelaCategorias } from "./categorias";
import { tabelaUnidadesMedida } from "./unidadesMedida";
import { type InferSelectModel } from "drizzle-orm";
import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import * as z4 from "zod/v4";

export const tabelaProdutos = sqliteTable("produtos", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  nome: text().notNull().default("Novo produto"),
  codigo: text().unique().notNull(),
  // TODO: Verificar metodo de utilizar funcionalidade, mas evitando
  // dependecias circulares.
  // .$defaultFn(() => geradorCodigo()),
  sku: text(),
  codigoBarra: text("codigo_barra"),
  descricao: text(),
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
    enum: [
      StatusProduto.Ativo,
      StatusProduto.Inativo,
      StatusProduto.Descontinuado,
      StatusProduto.Bloqueado,
    ],
  }).notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// Campos da tabela que podem ser atualizados. Os campos não são inferidos
// diretamente para evitar a permissão de edição de futuros campos que podem
// ser adicionados a tabela.
export const UpdateProdutosSchemaZ = z4.strictObject({
  nome: z4.string().optional(),
  sku: z4.string().optional(),
  codigoBarra: z4.string().optional(),
  descricao: z4.string().optional(),
  marca: z4.string().optional(),
  fornecedor: z4.string().optional(),
  dimensoes: z4.string().optional(),
  peso: z4.int().optional(),
  precoCusto: z4.int().optional(),
  precoVenda: z4.int().optional(),
  precoPromocao: z4.int().optional(),
  codigo: z4.string().optional(),
  // quantidadeUnidadeMedida: z4.string().optional(),
  quantidadeMinima: z4.int().optional(),
  quantidadeMaxima: z4.int().optional(),
  localizacao: z4.string().optional(),
  imagem: z4.base64().optional(),
  status: z4
    .enum([
      StatusProduto.Ativo,
      StatusProduto.Inativo,
      StatusProduto.Descontinuado,
      StatusProduto.Bloqueado,
    ])
    .optional(),
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
