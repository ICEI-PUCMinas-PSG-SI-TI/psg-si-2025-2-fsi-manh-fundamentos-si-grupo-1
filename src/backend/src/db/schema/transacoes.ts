import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tabelaLotes } from "./lotes";
import { tabelaProdutos } from "./produtos";
import { tabelaUsuarios } from "./usuarios";

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
  motivo: text().notNull(),
  quantidade: int().notNull(),
  horario: int({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  localOrigem: text("local_origem"),
  localDestino: text("local_destino"),
  observacao: text(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export type SelectTransacoesSchema = InferSelectModel<typeof tabelaTransacoes>;
export type UpdateTransacoesSchema = Partial<
  InferSelectModel<typeof tabelaTransacoes>
>;
export type InsertTransacoesSchema = InferInsertModel<typeof tabelaTransacoes>;
