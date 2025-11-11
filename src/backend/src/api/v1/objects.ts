import z from "zod";

export const ParamsIdSchemaZ = z.strictObject({
  id: z.uuid(),
});

export type UuidResult = z.infer<typeof ParamsIdSchemaZ>;

// TODO: Adicionar mais regras
export const PasswordZ = z.string().min(8).max(64);
