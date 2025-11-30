import { tabelaProdutos } from "./produtos";
import type { InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import * as z4 from "zod/v4";

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
export type UpdateLoteSchema = Partial<InferSelectModel<typeof tabelaLotes>>;
export type InsertLoteSchema = z4.infer<typeof InsertLoteSchemaZ>;
