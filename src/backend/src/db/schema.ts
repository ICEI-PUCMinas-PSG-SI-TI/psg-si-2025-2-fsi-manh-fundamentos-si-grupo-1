import { sql } from "drizzle-orm";
import { int, sqliteTable, text, blob as uuid } from "drizzle-orm/sqlite-core";

export const lotesTable = sqliteTable("lotes", {
  id: uuid().primaryKey(),
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
