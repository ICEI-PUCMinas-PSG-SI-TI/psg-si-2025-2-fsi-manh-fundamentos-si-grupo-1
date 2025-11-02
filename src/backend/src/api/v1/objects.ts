import z from "zod";

export const ParamsIdSchemaZ = z.strictObject({
  id: z.uuid(),
});

// TODO: Adicionar mais regras
export const PasswordZ = z.string().min(8).max(64);
