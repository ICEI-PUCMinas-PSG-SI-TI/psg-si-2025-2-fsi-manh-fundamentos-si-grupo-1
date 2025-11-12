import { sql } from "drizzle-orm";
import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
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
  /**
   * @deprecated Utilizar a tabela de permissões
   */
  nivelPermissoes: int("nivel_permissoes").notNull().default(3),
  foto: blob(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch()*1000)`),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch()*1000)`),
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
  // TODO: Verificar como limitar nível de proteção para alterar permissões do usuário
  nivelPermissoes: z4.int().min(0).max(3).optional(),
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

export const SelectUsuarioInfoSchemaZ = createSelectSchema(tabelaUsuarios, {
  id: z4.uuid(),
  habilitado: z4.boolean(),
  modoEscuro: z4.boolean(),
  foto: z4.base64().nullable(),
})
  .pick({
    id: true,
    foto: true,
    nome: true,
    descricao: true,
  })
  .strict();

export type SelectUsuarioSchema = InferSelectModel<typeof tabelaUsuarios>;
export type UpdateUsuarioSchema = z4.infer<typeof UpdateUsuarioSchemaZ>;
export type InsertUsuarioSchema = z4.infer<typeof InsertUsuarioSchemaZ>;
export type SelectUsuarioInfoSchema = z4.infer<typeof SelectUsuarioInfoSchemaZ>;
