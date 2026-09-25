import { z } from "@hono/zod-openapi";

import { createSuccessResponseSchema } from "@core/schemas/base.schema";
import { messageKeySchema } from "@core/schemas/common.schema";

export { messageKeySchema };

export const sendTextMessageSchema = z.object({
  jid: z.string().openapi({
    description: "Target JID (user or group)",
    example: "6281234567890@s.whatsapp.net",
  }),
  text: z.string().min(1).openapi({ example: "Hello from Baileys!" }),
});

export const deleteMessageSchema = z.object({
  jid: z.string().openapi({ example: "6281234567890@s.whatsapp.net" }),
  key: messageKeySchema,
});

export const editMessageSchema = z.object({
  jid: z.string().openapi({ example: "6281234567890@s.whatsapp.net" }),
  key: messageKeySchema,
  text: z.string().min(1).openapi({ example: "Edited message" }),
});

export const sendPollMessageSchema = z.object({
  jid: z.string().openapi({ example: "6281234567890@s.whatsapp.net" }),
  poll: z.object({
    name: z.string().openapi({ example: "Which do you prefer?" }),
    values: z.array(z.string()).min(1).openapi({ example: ["Option A", "Option B"] }),
    selectableCount: z.number().int().min(1).default(1),
  }),
});

// Baileys' WAMessage is a large protobuf-generated shape (optional/nullable
// fields throughout) that isn't practical to mirror exactly in Zod, so the
// response body is documented loosely rather than strictly validated.
const sentMessageSchema = z.any().openapi("SentMessage", {
  example: { key: { remoteJid: "6281234567890@s.whatsapp.net", id: "3EB0XXXXXXXXXXXXXXXX", fromMe: true } },
});

export const sentMessageSuccessResponse = createSuccessResponseSchema(sentMessageSchema);
