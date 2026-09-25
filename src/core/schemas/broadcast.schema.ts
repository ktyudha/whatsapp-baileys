import { z } from "@hono/zod-openapi";

import { jidSchema } from "@core/schemas/common.schema";

export const postStatusSchema = z.object({
  text: z.string().min(1),
  statusJidList: z.array(jidSchema).min(1),
  backgroundColor: z.string().optional().openapi({ example: "#25D366" }),
  font: z.number().int().optional(),
});

export const sendToListSchema = z.object({
  broadcastJid: jidSchema,
  content: z.any().openapi({
    description: "AnyMessageContent, e.g. { text: 'hello' } or { image: { url } }",
    example: { text: "Hello broadcast list!" },
  }),
});

export const broadcastJidParamsSchema = z.object({
  jid: jidSchema.openapi({ param: { name: "jid", in: "path" } }),
});
