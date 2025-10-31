import z from "zod";

export const ParamsIdSchemaZ = z.strictObject({
  id: z.uuid(),
});
