import { z } from "@hono/zod-openapi";

import { jidSchema, messageKeySchema } from "@core/schemas/common.schema";

export const reactSchema = z.object({
  jid: jidSchema,
  key: messageKeySchema,
  emoji: z.string().openapi({ description: "Emoji, or empty string to remove", example: "👍" }),
});

export const unreactSchema = z.object({
  jid: jidSchema,
  key: messageKeySchema,
});

export const sendLocationSchema = z.object({
  jid: jidSchema,
  latitude: z.number().openapi({ example: -6.2 }),
  longitude: z.number().openapi({ example: 106.816666 }),
});

// proto.Message.IContactMessage — a vCard-shaped Baileys/protobuf type, not
// practical to mirror exactly in Zod (see message.schema.ts).
export const sendContactSchema = z.object({
  jid: jidSchema,
  contacts: z.array(z.any()).min(1).openapi({
    description: "Array of proto.Message.IContactMessage (vCard) objects",
    example: [{ displayName: "John Doe", vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nEND:VCARD" }],
  }),
  displayName: z.string().optional(),
});

export const sendGroupInviteSchema = z.object({
  jid: jidSchema,
  groupInvite: z.any().openapi({
    description: "GroupInviteInfo (from getGroupInviteLink/getGroupInviteInfo)",
  }),
});

export const pinMessageSchema = z.object({
  jid: jidSchema,
  key: messageKeySchema,
  durationSeconds: z.union([z.literal(86400), z.literal(604800), z.literal(2592000)]).optional(),
});

export const unpinMessageSchema = z.object({
  jid: jidSchema,
  key: messageKeySchema,
});
