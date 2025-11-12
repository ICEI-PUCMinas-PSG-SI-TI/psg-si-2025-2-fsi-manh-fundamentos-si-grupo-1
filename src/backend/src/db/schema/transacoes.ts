import { sql, type InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import * as z4 from "zod/v4";
import { tabelaProdutos } from "./produtos";
import { tabelaUsuarios } from "./usuarios";
import { tabelaLotes } from "./lotes";

export const tabelaTransacoes = sqliteTable("transacoes", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  produtoId: text("produto_id")
    .notNull()
    .references(() => tabelaProdutos.id),
  usuarioId: text("usuario_id")
    .notNull()
    .references(() => tabelaUsuarios.id),
  loteId: text("lote_id")
    .notNull()
    .references(() => tabelaLotes.id),
  // TODO: Utilizar enum?
  motivo: text(),
  quantidade: int().notNull(),
  horario: int({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch()*1000)`),
  localOrigem: text("local_origem"),
  localDestino: text("local_destino"),
  observacao: text(),
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
export const UpdateTransacoesSchemaZ = z4.strictObject({
  produtoId: z4.uuid().optional(),
  usuarioId: z4.uuid().optional(),
  loteId: z4.uuid().optional(),
  motivo: z4.string(),
  quantidade: z4.int(),
  localOrigem: z4.string(),
  localDestino: z4.string(),
  observacao: z4.string(),
  horario: z4.coerce.date().optional(),
});

// Os campos de inserção podem ser inferidos. Alguns deles podem ser adicionalmente validados como UUID e omitidos.
export const InsertTransacoesSchemaZ = createInsertSchema(tabelaTransacoes, {
  id: z4.uuid().optional(),
  produtoId: z4.uuid(),
  usuarioId: z4.uuid(),
  loteId: z4.uuid(),
  horario: z4.coerce.date().optional(),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict();

export type SelectTransacoesSchema = InferSelectModel<typeof tabelaTransacoes>;
export type UpdateTransacoesSchema = z4.infer<typeof UpdateTransacoesSchemaZ>;
export type InsertTransacoesSchema = z4.infer<typeof InsertTransacoesSchemaZ>;
