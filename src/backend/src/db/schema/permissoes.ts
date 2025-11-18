import { sqliteTable, text, int, primaryKey } from "drizzle-orm/sqlite-core";
import { tabelaUsuarios } from "./usuarios";
import { type InferSelectModel } from "drizzle-orm";
import * as z4 from "zod/v4";
import { createInsertSchema } from "drizzle-zod";
import { Permissoes } from "../enums/permissoes";

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
