import { z } from "@hono/zod-openapi";

import { createSuccessResponseSchema } from "@core/schemas/base.schema";
import { jidSchema } from "@core/schemas/common.schema";

export const inviteLinkSchema = z
  .object({
    link: z.string().openapi({ example: "https://chat.whatsapp.com/AbCdEfGhIjKlMnOp" }),
  })
  .openapi("GroupInviteLink");

export const inviteLinkSuccessResponse = createSuccessResponseSchema(inviteLinkSchema);

export const joinedGroupSchema = z.object({ jid: jidSchema }).openapi("JoinedGroup");

export const joinedGroupSuccessResponse = createSuccessResponseSchema(joinedGroupSchema);

export const groupJidParamsSchema = z.object({
  jid: jidSchema.openapi({ param: { name: "jid", in: "path" } }),
});

export const inviteCodeParamsSchema = z.object({
  code: z.string().openapi({ param: { name: "code", in: "path" }, example: "AbCdEfGhIjKlMnOp" }),
});

export const createGroupSchema = z.object({
  subject: z.string().min(1).openapi({ example: "My Group" }),
  participants: z.array(jidSchema).min(1),
});

export const participantActionSchema = z.enum(["add", "remove", "promote", "demote", "modify"]);

export const updateParticipantsSchema = z.object({
  participants: z.array(jidSchema).min(1),
  action: participantActionSchema,
});

export const updateSubjectSchema = z.object({
  subject: z.string().min(1),
});

export const updateDescriptionSchema = z.object({
  description: z.string(),
});

export const updateSettingSchema = z.object({
  setting: z.enum(["announcement", "not_announcement", "locked", "unlocked"]),
});

export const updateMemberAddModeSchema = z.object({
  mode: z.enum(["admin_add", "all_member_add"]),
});

export const updateEphemeralSchema = z.object({
  expirationSeconds: z.number().int().min(0).openapi({ example: 86400 }),
});

export const joinByCodeSchema = z.object({
  code: z.string().min(1).openapi({ example: "AbCdEfGhIjKlMnOp" }),
});

export const joinRequestActionSchema = z.enum(["approve", "reject"]);

export const updateJoinRequestsSchema = z.object({
  participants: z.array(jidSchema).min(1),
  action: joinRequestActionSchema,
});
