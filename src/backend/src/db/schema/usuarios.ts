import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import * as z4 from "zod/v4";

export const tabelaUsuarios = sqliteTable("usuarios", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  nome: text().notNull(),
  // TODO: Verificar necessidade de login, email e identificação
  login: text().notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  descricao: text(),
  habilitado: int({ mode: "boolean" }).notNull().default(true),
  modoEscuro: int("modo_escuro", { mode: "boolean" }).notNull().default(false),
  foto: blob(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// Campos da tabela que podem ser atualizados. Os campos não são inferidos
// diretamente para evitar a permissão de edição de futuros campos que podem
// ser adicionados a tabela.
export const UpdateUsuarioSchemaZ = z4.strictObject({
  nome: z4.string().optional(),
  login: z4.string().optional(),
  hashedPassword: z4.string().optional(),
  descricao: z4.string().optional(),
  habilitado: z4.boolean().optional(),
  modoEscuro: z4.boolean().optional(),
  foto: z4.base64().optional(),
});

export const InsertUsuarioSchemaZ = createInsertSchema(tabelaUsuarios, {
  id: z4.uuid().optional(),
  habilitado: z4.boolean().optional(),
  modoEscuro: z4.boolean().optional(),
  foto: z4.base64().optional(),
  createdAt: z4.coerce.date().optional(),
  updatedAt: z4.coerce.date().optional(),
})
  .omit({
    id: true,
    updatedAt: true,
    createdAt: true,
  })
  .strict();

export type SelectUsuarioSchema = InferSelectModel<typeof tabelaUsuarios>;
export type UpdateUsuarioSchema = Partial<
  InferInsertModel<typeof tabelaUsuarios>
>;
export type InsertUsuarioSchema = z4.infer<typeof InsertUsuarioSchemaZ>;
