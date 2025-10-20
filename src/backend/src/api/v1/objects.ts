import z from "zod";

export const ParamsIdSchema = z.strictObject({
  id: z.uuid(),
});
