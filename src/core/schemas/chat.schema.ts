import { z } from "@hono/zod-openapi";

import { jidSchema, messageKeySchema } from "@core/schemas/common.schema";

export const markReadSchema = z.object({
  keys: z.array(messageKeySchema).min(1),
});

export const archiveChatSchema = z.object({
  jid: jidSchema,
  archive: z.boolean().default(true),
});

export const muteChatSchema = z.object({
  jid: jidSchema,
  durationMs: z.number().nullable().optional().openapi({
    description: "Mute duration in ms, or null to unmute",
    example: 28800000,
  }),
});

export const pinChatSchema = z.object({
  jid: jidSchema,
  pin: z.boolean().default(true),
});

export const deleteChatSchema = z.object({
  jid: jidSchema,
  lastMessageTimestamp: z.number().openapi({ description: "Unix timestamp (seconds)" }),
});

export const subscribePresenceSchema = z.object({
  jid: jidSchema,
});

export const presenceSchema = z.enum(["unavailable", "available", "composing", "recording", "paused"]);

export const sendPresenceSchema = z.object({
  jid: jidSchema,
  presence: presenceSchema,
});
