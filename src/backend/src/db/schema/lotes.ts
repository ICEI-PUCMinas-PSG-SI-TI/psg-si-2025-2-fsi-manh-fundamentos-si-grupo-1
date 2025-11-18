import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import * as z4 from "zod/v4";
import { tabelaProdutos } from "./produtos";

export const tabelaLotes = sqliteTable("lotes", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  produtoId: text("produto_id")
    .notNull()
    .references(() => tabelaProdutos.id),
  // Aqui poderia ser utilizado SQLITE(blob) e Uint8Array array, mas isso
  // dificulta exponencialmente a validação (zod), o retorno de dados e a
  // inserção de dados.
  /*
  id: uuid()
    .primaryKey()
    .notNull()
    .$defaultFn(() => parse(genUUID())),
  produto_id: uuid().primaryKey().notNull(),
  */
  codigo: text().notNull(),
  quantidade: int().notNull().default(0),
  validade: int({ mode: "timestamp_ms" }),
  // Default to current Unix epoch in seconds
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
export const UpdateLoteSchemaZ = z4.strictObject({
  lote: z4.string().min(1).optional(),
  quantidade: z4.number().optional(),
  validade: z4.coerce.date().optional(),
});

export const InsertLoteSchemaZ = createInsertSchema(tabelaLotes, {
  id: z4.uuid().optional(),
  produtoId: z4.uuid(),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict();

export type SelectLoteSchema = InferSelectModel<typeof tabelaLotes>;
export type UpdateLoteSchema = z4.infer<typeof UpdateLoteSchemaZ>;
export type InsertLoteSchema = z4.infer<typeof InsertLoteSchemaZ>;
