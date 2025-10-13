import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text, blob as uuid } from "drizzle-orm/sqlite-core";
import { parse, v4 as genUUID } from "uuid";

export const lotesTable = sqliteTable("lotes", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => parse(genUUID())),
  produto_id: uuid().notNull(),
  lote: text().notNull(),
  quantidade: int().notNull().default(0),
  validade: int({ mode: "timestamp" }),
  // Default to current Unix epoch in seconds
  created_at: int({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: int({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type InsertLote = InferInsertModel<typeof lotesTable>;
export type SelectLote = InferSelectModel<typeof lotesTable>;
