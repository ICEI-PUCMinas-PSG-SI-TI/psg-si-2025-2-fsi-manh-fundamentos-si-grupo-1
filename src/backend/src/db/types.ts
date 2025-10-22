import type { InferSelectModel } from "drizzle-orm";
import { lotesTable, usuariosTable } from "./schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

// Repositorio :: Lote

export const UpdateLoteSchemaZ = z.strictObject({
  lote: z.string().min(1).optional(),
  quantidade: z.number().optional(),
  validade: z.coerce.date().optional(),
});

export const InsertLoteSchemaZ = createInsertSchema(lotesTable, {
  id: z.uuid().optional(),
  produtoId: z.uuid(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export type SelectLoteSchema = InferSelectModel<typeof lotesTable>;
export type UpdateLoteSchema = z.infer<typeof UpdateLoteSchemaZ>;
export type InsertLoteSchema = z.infer<typeof InsertLoteSchemaZ>;

// Repositorio :: Usuários

export const UpdateUsuarioSchemaZ = z.strictObject({
  nome: z.string().optional(),
  login: z.string().optional(),
  saltedPassword: z.string().optional(),
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
  foto: z.base64(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type SelectUsuarioSchema = InferSelectModel<typeof usuariosTable>;
export type UpdateUsuarioSchema = z.infer<typeof UpdateUsuarioSchemaZ>;
export type InsertUsuarioSchema = z.infer<typeof InsertUsuarioSchemaZ>;
