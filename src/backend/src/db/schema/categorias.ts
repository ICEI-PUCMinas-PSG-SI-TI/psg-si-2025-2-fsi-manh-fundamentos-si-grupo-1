import { sql, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as genUUID } from "uuid";
import z from "zod";

// TODO: Verificar necessidade de desabilitar ou atualizar categorias
export const categoriasTable = sqliteTable("categorias", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  nome: text().notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const InsertCategoriaSchemaZ = createInsertSchema(categoriasTable, {
  id: z.uuid().optional(),
  nome: z.string().min(1).max(128),
}).strict();

export type SelectCategoriaSchema = InferSelectModel<typeof categoriasTable>;
export type InsertCategoriaSchema = z.infer<typeof InsertCategoriaSchemaZ>;
