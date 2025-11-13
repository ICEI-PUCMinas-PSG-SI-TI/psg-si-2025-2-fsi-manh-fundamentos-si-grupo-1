import * as z4 from "zod/v4";

export const ParamsIdSchemaZ = z4.strictObject({
  id: z4.uuid(),
});

export type UuidResult = z4.infer<typeof ParamsIdSchemaZ>;

// TODO: Adicionar mais regras
export const PasswordZ = z4.string().min(8).max(64);
