import { sql, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import * as z4 from "zod/v4";

// TODO: Verificar necessidade de desabilitar ou atualizar categorias
export const tabelaCategorias = sqliteTable("categorias", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  nome: text().notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch()*1000)`),
});

export const InsertCategoriaSchemaZ = createInsertSchema(tabelaCategorias, {
  id: z4.uuid().optional(),
  nome: z4.string().min(1).max(128),
})
  .omit({
    createdAt: true,
  })
  .strict();

export type SelectCategoriaSchema = InferSelectModel<typeof tabelaCategorias>;
export type InsertCategoriaSchema = z4.infer<typeof InsertCategoriaSchemaZ>;
