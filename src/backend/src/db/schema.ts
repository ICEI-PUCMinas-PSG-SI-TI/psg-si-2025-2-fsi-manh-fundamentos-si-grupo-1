import { sql } from "drizzle-orm";
import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as genUUID } from "uuid";

export const lotesTable = sqliteTable("lotes", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  produtoId: text("produto_id").notNull(),
  // Aqui poderia ser utilizado SQLITE(blob) e Uint8Array array, mas isso
  // dificulta exponencialmente a validação (zod), o retorno de dados e a
  // inserção de dados.
  /*
  id: uuid()
    .primaryKey()
    .notNull()
    .$defaultFn(() => parse(genUUID())),
  produto_id: uuid().primaryKey().notNull(),
  */
  lote: text().notNull(),
  quantidade: int().notNull().default(0),
  validade: int({ mode: "timestamp" }),
  // Default to current Unix epoch in seconds
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const usuariosTable = sqliteTable("usuario", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  nome: text().notNull(),
  // TODO: Verificar necessidade de login, email e identificação
  login: text().notNull(),
  saltedPassword: text("salted_password").notNull(),
  descricao: text(),
  habilitado: int({ mode: "boolean" }).notNull().default(false),
  modoEscuro: int("modo_escuro", { mode: "boolean" }).notNull().default(false),
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
