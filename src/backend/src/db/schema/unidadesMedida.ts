import { type InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import * as z4 from "zod/v4";

export const tabelaUnidadesMedida = sqliteTable("unidades_medida", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  nome: text().notNull().unique(),
  abreviacao: text().notNull().unique(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const InsertUnidadesMedidasSchemaZ = createInsertSchema(
  tabelaUnidadesMedida,
  {
    id: z4.uuid().optional(),
    nome: z4.string().min(1).max(128),
    abreviacao: z4.string().min(1).max(16),
  },
)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict();

export type SelectUnidadesMedidaSchema = InferSelectModel<
  typeof tabelaUnidadesMedida
>;
export type UpdateUnidadesMedidaSchema = Partial<
  InferSelectModel<typeof tabelaUnidadesMedida>
>;
export type InsertUnidadesMedidaSchema = z4.infer<
  typeof InsertUnidadesMedidasSchemaZ
>;
