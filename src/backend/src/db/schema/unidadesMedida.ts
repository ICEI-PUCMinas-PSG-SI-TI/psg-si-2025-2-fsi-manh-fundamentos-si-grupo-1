import { sql, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as genUUID } from "uuid";
import z from "zod";

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
export const UpdateUnidadesMedidasSchemaZ = z.strictObject({
  nome: z.string().min(1).max(128).optional(),
  abreviacao: z.string().min(1).max(16).optional(),
});

export const InsertUnidadesMedidasSchemaZ = createInsertSchema(
  tabelaUnidadesMedida,
  {
    id: z.uuid().optional(),
    nome: z.string().min(1).max(128),
    abreviacao: z.string().min(1).max(16),
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
export type UpdateUnidadesMedidaSchema = z.infer<
  typeof UpdateUnidadesMedidasSchemaZ
>;
export type InsertUnidadesMedidaSchema = z.infer<
  typeof InsertUnidadesMedidasSchemaZ
>;
