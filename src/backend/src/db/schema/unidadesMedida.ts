import { sql, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as genUUID } from "uuid";
import * as z4 from "zod/v4";

export const tabelaUnidadesMedida = sqliteTable("unidades_medida", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  nome: text().notNull(),
  abreviacao: text().notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch()*1000)`),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch()*1000)`),
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
