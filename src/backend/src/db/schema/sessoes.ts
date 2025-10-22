import { sql, type InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as genUUID } from "uuid";
import z from "zod";

export const sessoesTable = sqliteTable("sessoes", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  userId: text("user_id").notNull(),
  token: text().notNull(),
  userAgent: text("user_agent"),
  ip: text().notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const UpdateSessaoSchemaZ = z.strictObject({
  token: z.string().optional(),
});

export const InsertSessaoSchemaZ = createInsertSchema(sessoesTable, {
  id: z.uuid().optional(),
  userId: z.uuid(),
  ip: z.union([z.ipv4(), z.ipv6()]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export type SelectSessaoSchema = InferSelectModel<typeof sessoesTable>;
export type UpdateSessaoSchema = z.infer<typeof UpdateSessaoSchemaZ>;
export type InsertSessaoSchema = z.infer<typeof InsertSessaoSchemaZ>;
