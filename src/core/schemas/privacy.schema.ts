import { z } from "@hono/zod-openapi";

import { jidSchema } from "@core/schemas/common.schema";

export const blockContactSchema = z.object({
  jid: jidSchema,
});

const valueSchema = <T extends [string, ...string[]]>(values: T) => z.object({ value: z.enum(values) });

export const updatePrivacyValueSchema = valueSchema(["all", "contacts", "contact_blacklist", "none"] as const);
export const updateOnlinePrivacySchema = valueSchema(["all", "match_last_seen"] as const);
export const updateGroupsAddPrivacySchema = valueSchema(["all", "contacts", "contact_blacklist"] as const);
export const updateReadReceiptsPrivacySchema = valueSchema(["all", "none"] as const);
export const updateCallPrivacySchema = valueSchema(["all", "known"] as const);
export const updateMessagesPrivacySchema = valueSchema(["all", "contacts"] as const);

export const updateDisappearingModeSchema = z.object({
  durationSeconds: z.number().int().min(0).openapi({ example: 604800 }),
});
