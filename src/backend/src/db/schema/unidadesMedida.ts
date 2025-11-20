import { type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
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

// Campos da tabela que podem ser atualizados. Os campos não são inferidos
// diretamente para evitar a permissão de edição de futuros campos que podem
// ser adicionados a tabela.
export const UpdateUnidadesMedidasSchemaZ = z4.strictObject({
  nome: z4.string().min(1).max(128).optional(),
  abreviacao: z4.string().min(1).max(16).optional(),
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
export type UpdateUnidadesMedidaSchema = z4.infer<
  typeof UpdateUnidadesMedidasSchemaZ
>;
export type InsertUnidadesMedidaSchema = z4.infer<
  typeof InsertUnidadesMedidasSchemaZ
>;
