import { sql, type InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as genUUID } from "uuid";
import z from "zod";
import { produtosTable } from "./produtos";
import { usuariosTable } from "./usuarios";
import { lotesTable } from "./lotes";

export const transacoesTable = sqliteTable("transacoes", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  produtoId: text("produto_id")
    .notNull()
    .references(() => produtosTable.id),
  usuarioId: text("usuario_id")
    .notNull()
    .references(() => usuariosTable.id),
  loteId: text("lote_id")
    .notNull()
    .references(() => lotesTable.id),
  // TODO: Utilizar enum?
  motivo: text(),
  quantidade: int().notNull(),
  horario: int({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  localOrigem: text("local_origem"),
  localDestino: text("local_destino"),
  observacao: text(),
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Campos da tabela que podem ser atualizados. Os campos não são inferidos
// diretamente para evitar a permissão de edição de futuros campos que podem
// ser adicionados a tabela.
export const UpdateTransacoesSchemaZ = z.strictObject({
  produtoId: z.uuid().optional(),
  usuarioId: z.uuid().optional(),
  loteId: z.uuid().optional(),
  motivo: z.string(),
  quantidade: z.int(),
  localOrigem: z.string(),
  localDestino: z.string(),
  observacao: z.string(),
  horario: z.coerce.date().optional(),
});

// Os campos de inserção podem ser inferidos. Alguns deles podem ser adicionalmente validados como UUID e omitidos.
export const InsertTransacoesSchemaZ = createInsertSchema(transacoesTable, {
  id: z.uuid().optional(),
  produtoId: z.uuid(),
  usuarioId: z.uuid(),
  loteId: z.uuid(),
  horario: z.coerce.date().optional(),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict();

export type SelectTransacoesSchema = InferSelectModel<typeof transacoesTable>;
export type UpdateTransacoesSchema = z.infer<typeof UpdateTransacoesSchemaZ>;
export type InsertTransacoesSchema = z.infer<typeof InsertTransacoesSchemaZ>;
