import { sql, type InferSelectModel } from "drizzle-orm";
import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { usuariosTable } from "./usuarios";

// NOTE: UserAgent and ipAddress will be recorded at login time, for now, this will not be updated or invalidated if user changes those infos
export const sessoesTable = sqliteTable("sessoes", {
  id: text().primaryKey().notNull(),
  secretHash: blob("secret_hash", { mode: "buffer" }).notNull(),
  usuarioId: text("user_id")
    .notNull()
    .references(() => usuariosTable.id),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const InsertSessaoSchemaZ = createInsertSchema(sessoesTable, {
  usuarioId: z.uuid(),
  ipAddress: z.union([z.ipv4(), z.ipv6()]),
})
  .omit({
    createdAt: true,
  })
  .strict();

export type SelectSessaoSchema = InferSelectModel<typeof sessoesTable>;
export type InsertSessaoSchema = z.infer<typeof InsertSessaoSchemaZ>;
