import { Identificador } from "../enums/identificador";
import { type InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import * as z4 from "zod/v4";

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
      Identificador.Numerico,
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
export type UpdateConfiguracaoSchema = Partial<
  InferSelectModel<typeof tabelaConfiguracoes>
>;
export type InsertConfiguracaoSchema = z4.infer<
  typeof InsertConfiguracaoSchemaZ
>;
