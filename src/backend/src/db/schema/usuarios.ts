import { sql } from "drizzle-orm";
import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as genUUID } from "uuid";
import type { InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

export const usuariosTable = sqliteTable("usuarios", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  nome: text().notNull(),
  // TODO: Verificar necessidade de login, email e identificação
  login: text().notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  descricao: text(),
  habilitado: int({ mode: "boolean" }).notNull().default(false),
  modoEscuro: int("modo_escuro", { mode: "boolean" }).notNull().default(false),
  // TODO: Verificar se esse formato é o ideal para validar permissões
  nivelPermissoes: int("nivel_permissoes").notNull().default(3),
  foto: blob(),
  // TODO: Campo não é necessário, haverá logs separados
  // criado_por: text(),
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
export const UpdateUsuarioSchemaZ = z.strictObject({
  nome: z.string().optional(),
  login: z.string().optional(),
  hashedPassword: z.string().optional(),
  descricao: z.string().optional(),
  habilitado: z.boolean().optional(),
  modoEscuro: z.boolean().optional(),
  foto: z.base64().optional(),
  // TODO: Verificar como limitar nível de proteção para alterar permissões do usuário
  nivelPermissoes: z.int().min(0).max(3).optional(),
});

export const InsertUsuarioSchemaZ = createInsertSchema(usuariosTable, {
  id: z.uuid().optional(),
  habilitado: z.boolean().optional(),
  modoEscuro: z.boolean().optional(),
  foto: z.base64().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export type SelectUsuarioSchema = InferSelectModel<typeof usuariosTable>;
export type UpdateUsuarioSchema = z.infer<typeof UpdateUsuarioSchemaZ>;
export type InsertUsuarioSchema = z.infer<typeof InsertUsuarioSchemaZ>;
