import { type InferSelectModel } from "drizzle-orm";
import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import * as z4 from "zod/v4";
import { tabelaUsuarios } from "./usuarios";

// NOTE: UserAgent and ipAddress will be recorded at login time, for now, this will not be updated or invalidated if user changes those infos
export const tabelaSessoes = sqliteTable("sessoes", {
  id: text().primaryKey().notNull(),
  secretHash: blob("secret_hash", { mode: "buffer" }).notNull(),
  usuarioId: text("user_id")
    .notNull()
    .references(() => tabelaUsuarios.id),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address").notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const InsertSessaoSchemaZ = createInsertSchema(tabelaSessoes, {
  usuarioId: z4.uuid(),
  ipAddress: z4.union([z4.ipv4(), z4.ipv6()]),
})
  .omit({
    createdAt: true,
  })
  .strict();

export type SelectSessaoSchema = InferSelectModel<typeof tabelaSessoes>;
export type InsertSessaoSchema = z4.infer<typeof InsertSessaoSchemaZ>;
