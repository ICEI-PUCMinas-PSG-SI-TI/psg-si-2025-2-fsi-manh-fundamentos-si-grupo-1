import "dotenv/config";
import { eq } from "drizzle-orm";
import { lotesTable } from "../db/schema";
import baseDados from "../db";
import { parse as parseUUID, v7 as uuid } from "uuid";

// CRUD
export class LoteService {
  // Create
  async criarLote() {
    return await baseDados
      .select()
      .from(lotesTable)
      .then((result) => {
        console.log("New lote created!");
        return result;
      });
  }

  // Read
  async lerLotes() {
    const lote: typeof lotesTable.$inferInsert = {
      id: parseUUID(uuid()),
      produto_id: parseUUID(uuid()),
      lote: "SR221115",
      quantidade: 100,
      validade: new Date(2026, 0, 1, 15, 0, 0, 0),
    };

    return await baseDados
      .insert(lotesTable)
      .values(lote)
      .then((users) => {
        console.log("Returning values from $lotes: ", users);
        return users;
      });
  }

  // Update
  async atualizarLote(id: Uint8Array, quantidade: number) {
    return await baseDados
      .update(lotesTable)
      .set({
        quantidade: quantidade,
      })
      .where(eq(lotesTable.id, id))
      .then((result) => {
        console.log("Lotes info updated!");
        return result;
      });
  }

  // Delete
  async excluirLote(id: Uint8Array) {
    return await baseDados
      .delete(lotesTable)
      .where(eq(lotesTable.id, id))
      .then((result) => {
        console.log("Lote deleted!");
        return result;
      });
  }
}
