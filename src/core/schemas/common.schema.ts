import { z } from "@hono/zod-openapi";

import { createSuccessResponseSchema } from "@core/schemas/base.schema";

/** Success response with no payload, e.g. fire-and-forget actions. */
export const nullSuccessResponse = createSuccessResponseSchema(z.null());

/**
 * Success response for endpoints returning a Baileys object (WAMessage,
 * GroupMetadata, ...) that isn't practical to mirror exactly in Zod, since
 * they're large protobuf-generated shapes with optional/nullable fields
 * throughout. Documented loosely rather than strictly validated.
 */
export const anySuccessResponse = createSuccessResponseSchema(z.any());

export const jidSchema = z.string().openapi({
  description: "WhatsApp JID (user or group)",
  example: "6281234567890@s.whatsapp.net",
});

export const jidParamsSchema = z.object({
  jid: jidSchema,
});

export const messageKeySchema = z.object({
  remoteJid: z.string().openapi({ example: "6281234567890@s.whatsapp.net" }),
  id: z.string().openapi({ example: "3EB0XXXXXXXXXXXXXXXX" }),
  fromMe: z.boolean().openapi({ example: true }),
  participant: z.string().optional(),
});
