import bancoDados from "../db";
import type { ResultSet } from "@libsql/client";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { SQLiteTransaction } from "drizzle-orm/sqlite-core";

export type SQLiteTransactionCustom = SQLiteTransaction<
  "async",
  ResultSet,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;

export class RepositorioBase {
  utilizarTransacao(
    callback: (tx: SQLiteTransactionCustom) => Promise<unknown>,
  ): Promise<unknown> {
    return bancoDados.transaction(callback);
  }
}
