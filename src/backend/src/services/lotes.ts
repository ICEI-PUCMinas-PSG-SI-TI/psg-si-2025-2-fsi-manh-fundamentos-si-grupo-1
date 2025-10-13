import "dotenv/config";
import { eq } from "drizzle-orm";
import { lotesTable, type InsertLote, type SelectLote } from "../db/schema";
import baseDados from "../db";
import { stringify as stringifyUUID } from "uuid";
import { debug, json, LogLevel } from "../logging";

function updateUUID(result: SelectLote[]) {
  result.forEach((_, index, array) => {
    if (!array[index]) return;
    if (array[index].id instanceof Uint8Array) {
      array[index].id = stringifyUUID(array[index].id);
    }
    if (array[index].produto_id instanceof Uint8Array) {
      array[index].produto_id = stringifyUUID(array[index].produto_id);
    }
  });
  return result;
}

export class LoteService {
  async inserir(lote: InsertLote) {
    return await baseDados
      .insert(lotesTable)
      .values(lote)
      .then((result) => {
        debug(`Novo lote criado!`, { label: "LoteService" });
        return result.lastInsertRowid;
      });
  }

  async selecionarTodos() {
    return await baseDados
      .select()
      .from(lotesTable)
      .then(updateUUID)
      .then((result) => {
        debug(`Retornando lotes`, { label: "LoteService" });
        return result;
      });
  }

  async selecionarId(id: Uint8Array) {
    return await baseDados
      .select()
      .from(lotesTable)
      .where(eq(lotesTable.id, id))
      .then(updateUUID)
      .then((result) => {
        let strId = stringifyUUID(id);
        debug(`Retornando lote ${strId}`, { label: "LoteService" });
        return result;
      });
  }

  async atualizar(id: Uint8Array, quantidade: number) {
    return await baseDados
      .update(lotesTable)
      .set({
        quantidade: quantidade,
      })
      .where(eq(lotesTable.id, id))
      .then((result) => {
        let strId = stringifyUUID(id);
        debug(`Informações do lote ${strId} atualizadas!`, {
          label: "LoteService",
        });
        return result;
      });
  }

  async excluir(id: Uint8Array) {
    return await baseDados
      .delete(lotesTable)
      .where(eq(lotesTable.id, id))
      .then((result) => {
        let strId = stringifyUUID(id);
        debug(`Informações do lote ${strId} excluidas!`, {
          label: "LoteService",
        });
        return result;
      });
  }
}
