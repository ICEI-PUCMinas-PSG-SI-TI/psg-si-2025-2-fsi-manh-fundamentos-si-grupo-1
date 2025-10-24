import type { InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as genUUID } from "uuid";
import z from "zod";

export const categoriasTable = sqliteTable("categorias", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  nome: text().notNull(),
});

export const InsertLoteSchemaZ = createInsertSchema(categoriasTable, {
  id: z.uuid().optional(),
  nome: z.string().min(1).max(128),
}).strict();

export type SelectLoteSchema = InferSelectModel<typeof categoriasTable>;
export type InsertLoteSchema = z.infer<typeof InsertLoteSchemaZ>;
