import { sqliteTable, text, int, primaryKey } from "drizzle-orm/sqlite-core";
import { tabelaUsuarios } from "./usuarios";
import { sql, type InferSelectModel } from "drizzle-orm";
import z from "zod";
import { createInsertSchema } from "drizzle-zod";

// TODO: Tornar campos dinamicos
export enum Permissoes {
  Desenvolvedor = "DEV",
  Administrador = "ADM",
  Operacional = "OP",
  Consulta = "CONSULTA",
}

export const tabelaPermissoes = sqliteTable(
  "permissoes",
  {
    usuarioId: text("user_id")
      .notNull()
      .references(() => tabelaUsuarios.id),
    cargo: text({
      enum: [
        Permissoes.Administrador,
        Permissoes.Desenvolvedor,
        Permissoes.Operacional,
        Permissoes.Consulta,
      ],
    }).notNull(),
    createdAt: int("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch()*1000)`),
    updatedAt: int("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch()*1000)`),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.usuarioId, table.cargo],
    }),
  }),
);

export const InsertPermissoesSchemaZ = createInsertSchema(tabelaPermissoes, {
  usuarioId: z.uuid(),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict();

export type SelectPermissoesSchema = InferSelectModel<typeof tabelaPermissoes>;
export type InsertPermissoesSchema = z.infer<typeof InsertPermissoesSchemaZ>;
