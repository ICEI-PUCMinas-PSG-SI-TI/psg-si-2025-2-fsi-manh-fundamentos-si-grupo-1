import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as genUUID } from "uuid";
import type { InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

export const lotesTable = sqliteTable("lotes", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  produtoId: text("produto_id").notNull(),
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
  lote: text().notNull(),
  quantidade: int().notNull().default(0),
  validade: int({ mode: "timestamp" }),
  // Default to current Unix epoch in seconds
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const UpdateLoteSchemaZ = z.strictObject({
  lote: z.string().min(1).optional(),
  quantidade: z.number().optional(),
  validade: z.coerce.date().optional(),
});

export const InsertLoteSchemaZ = createInsertSchema(lotesTable, {
  id: z.uuid().optional(),
  produtoId: z.uuid(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export type SelectLoteSchema = InferSelectModel<typeof lotesTable>;
export type UpdateLoteSchema = z.infer<typeof UpdateLoteSchemaZ>;
export type InsertLoteSchema = z.infer<typeof InsertLoteSchemaZ>;
