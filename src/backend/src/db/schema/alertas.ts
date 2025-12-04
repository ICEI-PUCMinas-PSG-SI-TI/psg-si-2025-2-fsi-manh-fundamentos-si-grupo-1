import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MotivoAlerta } from "../enums/motivoAlerta";
import { tabelaLotes } from "./lotes";
import { tabelaProdutos } from "./produtos";

export const tabelaAlertas = sqliteTable("alertas", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  produtoId: text("produto_id")
    .notNull()
    .references(() => tabelaProdutos.id),
  loteId: text("lote_id").references(() => tabelaLotes.id),
  motivo: text({
    enum: [
      MotivoAlerta.Validade,
      MotivoAlerta.QuantidadeMinima,
      MotivoAlerta.QuantidadeMaxima,
    ],
  }).notNull(),
  mutadoAte: int("mudato_ate", { mode: "timestamp_ms" }),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export type SelectAlertaSchema = InferSelectModel<typeof tabelaAlertas>;
export type UpdateAlertaSchema = Partial<
  InferInsertModel<typeof tabelaAlertas>
>;
export type InsertAlertaSchema = InferInsertModel<typeof tabelaAlertas>;
