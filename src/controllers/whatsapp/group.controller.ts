import type { RouteHandler } from "@hono/zod-openapi";

import { fail, ok, withSocket } from "@core/helpers/index.helper";
import type {
  CreateGroupRoute,
  GetAllGroupsRoute,
  GetGroupMetadataRoute,
  GetInviteLinkRoute,
  InviteInfoRoute,
  JoinByCodeRoute,
  LeaveGroupRoute,
  ListJoinRequestsRoute,
  RevokeInviteLinkRoute,
  UpdateDescriptionRoute,
  UpdateEphemeralRoute,
  UpdateJoinRequestsRoute,
  UpdateMemberAddModeRoute,
  UpdateParticipantsRoute,
  UpdateSettingRoute,
  UpdateSubjectRoute,
} from "@routes/whatsapp/group.routes";
import {
  createGroup,
  getAllParticipatingGroups,
  getGroupMetadata,
  leaveGroup,
  toggleGroupEphemeral,
  updateGroupDescription,
  updateGroupMemberAddMode,
  updateGroupParticipants,
  updateGroupSetting,
  updateGroupSubject,
} from "@services/whatsapp/group/manage-group.service";
import {
  getGroupInviteInfo,
  getGroupInviteLink,
  joinGroupByInviteCode,
  listGroupJoinRequests,
  revokeGroupInviteLink,
  updateGroupJoinRequests,
} from "@services/whatsapp/group/group-invite.service";

export const create: RouteHandler<CreateGroupRoute> = withSocket(async (c, sock) => {
  const { subject, participants } = c.req.valid("json");

  const group = await createGroup(sock, subject, participants);

  return group ? ok(c, group, "Group created") : fail(c, "Failed to create group", 500);
});

export const updateParticipants: RouteHandler<UpdateParticipantsRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");
  const { participants, action } = c.req.valid("json");

  const result = await updateGroupParticipants(sock, jid, participants, action);

  return ok(c, result, "Group participants updated");
});

export const updateSubject: RouteHandler<UpdateSubjectRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");
  const { subject } = c.req.valid("json");

  await updateGroupSubject(sock, jid, subject);

  return ok(c, null, "Group subject updated");
});

export const updateDescription: RouteHandler<UpdateDescriptionRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");
  const { description } = c.req.valid("json");

  await updateGroupDescription(sock, jid, description);

  return ok(c, null, "Group description updated");
});

export const updateSetting: RouteHandler<UpdateSettingRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");
  const { setting } = c.req.valid("json");

  await updateGroupSetting(sock, jid, setting);

  return ok(c, null, "Group setting updated");
});

export const updateMemberAddMode: RouteHandler<UpdateMemberAddModeRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");
  const { mode } = c.req.valid("json");

  await updateGroupMemberAddMode(sock, jid, mode);

  return ok(c, null, "Group member add mode updated");
});

export const updateEphemeral: RouteHandler<UpdateEphemeralRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");
  const { expirationSeconds } = c.req.valid("json");

  await toggleGroupEphemeral(sock, jid, expirationSeconds);

  return ok(c, null, "Group ephemeral messages updated");
});

export const leave: RouteHandler<LeaveGroupRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");

  await leaveGroup(sock, jid);

  return ok(c, null, "Left group");
});

export const getMetadata: RouteHandler<GetGroupMetadataRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");
  const metadata = await getGroupMetadata(sock, jid);

  return metadata ? ok(c, metadata) : fail(c, "Failed to fetch group metadata", 404, "NOT_FOUND");
});

export const getAllGroups: RouteHandler<GetAllGroupsRoute> = withSocket(async (c, sock) => {
  const groups = await getAllParticipatingGroups(sock);

  return groups ? ok(c, groups) : fail(c, "Failed to fetch participating groups", 500);
});

export const getInviteLink: RouteHandler<GetInviteLinkRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");
  const link = await getGroupInviteLink(sock, jid);

  return link ? ok(c, { link }) : fail(c, "Failed to get group invite link", 500);
});

export const revokeInviteLink: RouteHandler<RevokeInviteLinkRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");
  const link = await revokeGroupInviteLink(sock, jid);

  return link ? ok(c, { link }, "Invite link revoked") : fail(c, "Failed to revoke invite link", 500);
});

export const joinByCode: RouteHandler<JoinByCodeRoute> = withSocket(async (c, sock) => {
  const { code } = c.req.valid("json");

  const jid = await joinGroupByInviteCode(sock, code);

  return jid ? ok(c, { jid }, "Joined group") : fail(c, "Failed to join group", 500);
});

export const inviteInfo: RouteHandler<InviteInfoRoute> = withSocket(async (c, sock) => {
  const { code } = c.req.valid("param");
  const metadata = await getGroupInviteInfo(sock, code);

  return metadata ? ok(c, metadata) : fail(c, "Failed to get invite info", 404, "NOT_FOUND");
});

export const listJoinRequests: RouteHandler<ListJoinRequestsRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");
  const requests = await listGroupJoinRequests(sock, jid);

  return requests ? ok(c, requests) : fail(c, "Failed to list join requests", 500);
});

export const updateJoinRequests: RouteHandler<UpdateJoinRequestsRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");
  const { participants, action } = c.req.valid("json");

  const result = await updateGroupJoinRequests(sock, jid, participants, action);

  return ok(c, result, "Join requests updated");
});
