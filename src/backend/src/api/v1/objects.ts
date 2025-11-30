import * as z4 from "zod/v4";

export const ParamsIdSchemaZ = z4.strictObject({
  id: z4.uuid(),
});

// TODO: Adicionar mais regras
export const SenhaZ = z4.string().min(8).max(64);
