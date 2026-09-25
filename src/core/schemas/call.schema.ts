import { z } from "@hono/zod-openapi";

export const rejectCallSchema = z.object({
  id: z.string().openapi({ description: "Call ID from the `call` event", example: "AAAAAAAAAAAAAAAAAAAAAAAA" }),
  from: z.string().openapi({ example: "6281234567890@s.whatsapp.net" }),
});
