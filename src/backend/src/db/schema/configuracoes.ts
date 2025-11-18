import { type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import * as z4 from "zod/v4";
import { Identificador } from "../enums/identificador";

export const tabelaConfiguracoes = sqliteTable("configuracoes", {
  // TODO: Generate always the same id for config?
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  nomeCliente: text("nome_cliente"),
  cpfCnpj: text("cpf_cnpj"),
  endereco: text(),
  identificador: text({
    enum: [
      Identificador.Numero,
      Identificador.Hexadecimal,
      Identificador.Seguro,
    ],
  })
    .notNull()
    .default(Identificador.Seguro),
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
export const UpdateConfiguracaoSchemaZ = z4.strictObject({
  nomeCliente: z4.string().nullish(),
  cpfCnpj: z4.string().nullish(),
  endereco: z4.string().nullish(),
});

export const InsertConfiguracaoSchemaZ = createInsertSchema(
  tabelaConfiguracoes,
  {
    id: z4.uuid().optional(),
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
export type UpdateConfiguracaoSchema = z4.infer<
  typeof UpdateConfiguracaoSchemaZ
>;
export type InsertConfiguracaoSchema = z4.infer<
  typeof InsertConfiguracaoSchemaZ
>;
