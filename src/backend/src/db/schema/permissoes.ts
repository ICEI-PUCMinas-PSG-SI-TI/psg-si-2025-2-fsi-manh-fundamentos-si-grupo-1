import { Permissoes } from "../enums/permissoes";
import { tabelaUsuarios } from "./usuarios";
import { type InferSelectModel } from "drizzle-orm";
import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import * as z4 from "zod/v4";

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
      .$defaultFn(() => new Date()),
    updatedAt: int("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.usuarioId, table.cargo],
    }),
  }),
);

export const InsertPermissoesSchemaZ = createInsertSchema(tabelaPermissoes, {
  usuarioId: z4.uuid(),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict();

export type SelectPermissoesSchema = InferSelectModel<typeof tabelaPermissoes>;
export type InsertPermissoesSchema = z4.infer<typeof InsertPermissoesSchemaZ>;
