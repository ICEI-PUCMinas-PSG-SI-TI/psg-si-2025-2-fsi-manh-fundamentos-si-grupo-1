import { sql, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as genUUID } from "uuid";
import z from "zod";

export const tabelaConfiguracoes = sqliteTable("configuracoes", {
  // TODO: Generate always the same id for config?
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => genUUID()),
  nomeCliente: text("nome_cliente"),
  cpfCnpj: text("cpf_cnpj"),
  endereco: text(),
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
export const UpdateConfiguracaoSchemaZ = z.strictObject({
  nomeCliente: z.string().nullish(),
  cpfCnpj: z.string().nullish(),
  endereco: z.string().nullish(),
});

export const InsertConfiguracaoSchemaZ = createInsertSchema(
  tabelaConfiguracoes,
  {
    id: z.uuid().optional(),
    // TODO(!scope): Validar cpf/cnpj?
  },
)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict();

export type SelectConfiguracaoSchema = InferSelectModel<
  typeof tabelaConfiguracoes
>;
export type UpdateConfiguracaoSchema = z.infer<
  typeof UpdateConfiguracaoSchemaZ
>;
export type InsertConfiguracaoSchema = z.infer<
  typeof InsertConfiguracaoSchemaZ
>;
