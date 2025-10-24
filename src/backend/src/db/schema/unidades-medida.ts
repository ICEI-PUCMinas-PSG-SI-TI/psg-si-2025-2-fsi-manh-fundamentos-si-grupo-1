import type { InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as genUUID } from "uuid";
import z from "zod";

export const unidadesMedidaTable = sqliteTable("unidades_medida", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  nome: text().notNull(),
  abreviacao: text().notNull(),
});

export const UpdateUnidadesMedidasSchemaZ = z.strictObject({
  nome: z.string().min(1).max(128),
  abreviacao: z.string().min(1).max(16),
});

export const InsertUnidadesMedidasSchemaZ = createInsertSchema(
  unidadesMedidaTable,
  {
    id: z.uuid().optional(),
    nome: z.string().min(1).max(128),
    abreviacao: z.string().min(1).max(16),
  },
).strict();

export type SelectUnidadesMedidaSchema = InferSelectModel<
  typeof unidadesMedidaTable
>;
export type UpdateUnidadesMedidaSchema = z.infer<
  typeof UpdateUnidadesMedidasSchemaZ
>;
export type InsertUnidadesMedidaSchema = z.infer<
  typeof InsertUnidadesMedidasSchemaZ
>;
