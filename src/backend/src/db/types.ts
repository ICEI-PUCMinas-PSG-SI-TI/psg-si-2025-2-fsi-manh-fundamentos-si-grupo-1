import type { InferSelectModel } from "drizzle-orm";
import { lotesTable } from "./schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

export const UpdateLoteSchemaZ = z.strictObject({
  lote: z.string().min(1).optional(),
  quantidade: z.number().optional(),
  validade: z.coerce.date().optional(),
});

export const InsertLoteSchemaZ = createInsertSchema(lotesTable, {
  id: z.uuid().optional(),
  produto_id: z.uuid(),
});

InsertLoteSchemaZ.strict();

export type SelectLoteSchema = InferSelectModel<typeof lotesTable>;
export type UpdateLoteSchema = z.infer<typeof UpdateLoteSchemaZ>;
export type InsertLoteSchema = z.infer<typeof InsertLoteSchemaZ>;
