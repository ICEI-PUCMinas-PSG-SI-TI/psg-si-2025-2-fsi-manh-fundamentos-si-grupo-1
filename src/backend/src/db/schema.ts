import { sql, type InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as genUUID } from "uuid";
import z from "zod";

export const lotesTable = sqliteTable("lotes", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  produto_id: text().notNull(),
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
  created_at: int({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: int({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type SelectLote = InferSelectModel<typeof lotesTable>;

export type UpdateLote = {
  lote?: string;
  quantidade?: number;
  validade?: Date;
};

export const loteUpdateSchema = z.object({
  lote: z.string().min(1).optional(),
  quantidade: z.number().optional(),
  validade: z.iso.datetime(),
});

export type UpdateLoteZ = z.infer<typeof loteUpdateSchema>;

export const InsertLoteSchemaZ = createInsertSchema(lotesTable, {
  id: z.uuid().optional(),
  produto_id: z.uuid(),
});

export type InsertLoteSchema = z.infer<typeof InsertLoteSchemaZ>;
