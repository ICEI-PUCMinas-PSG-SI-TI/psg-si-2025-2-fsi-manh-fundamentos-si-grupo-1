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

// Campos da tabela que podem ser atualizados. Os campos não são inferidos
// diretamente para evitar a permissão de edição de futuros campos que podem
// ser adicionados a tabela.
export const UpdateSessaoSchemaZ = z.strictObject({
  token: z.string().optional(),
});

export const InsertSessaoSchemaZ = createInsertSchema(sessoesTable, {
  id: z.uuid().optional(),
  userId: z.uuid(),
  ip: z.union([z.ipv4(), z.ipv6()]),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict();

export type SelectSessaoSchema = InferSelectModel<typeof sessoesTable>;
export type UpdateSessaoSchema = z.infer<typeof UpdateSessaoSchemaZ>;
export type InsertSessaoSchema = z.infer<typeof InsertSessaoSchemaZ>;
