import type { ParticipantAction } from "@whiskeysockets/baileys";

import { fail, ok, requireFields, withSocket } from "@core/helpers/index.helper";
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

export const create = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["subject", "participants"]);

  if (error) return error;

  const group = await createGroup(sock, body.subject, body.participants);

  return group ? ok(c, group, "Group created") : fail(c, "Failed to create group", 500);
});

export const updateParticipants = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;
  const body = await c.req.json();
  const error = requireFields(c, body, ["participants", "action"]);

  if (error) return error;

  const result = await updateGroupParticipants(
    sock,
    jid,
    body.participants,
    body.action as ParticipantAction,
  );

  return ok(c, result, "Group participants updated");
});

export const updateSubject = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;
  const body = await c.req.json();
  const error = requireFields(c, body, ["subject"]);

  if (error) return error;

  await updateGroupSubject(sock, jid, body.subject);

  return ok(c, null, "Group subject updated");
});

export const updateDescription = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;
  const body = await c.req.json();
  const error = requireFields(c, body, ["description"]);

  if (error) return error;

  await updateGroupDescription(sock, jid, body.description);

  return ok(c, null, "Group description updated");
});

export const updateSetting = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;
  const body = await c.req.json();
  const error = requireFields(c, body, ["setting"]);

  if (error) return error;

  await updateGroupSetting(sock, jid, body.setting);

  return ok(c, null, "Group setting updated");
});

export const updateMemberAddMode = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;
  const body = await c.req.json();
  const error = requireFields(c, body, ["mode"]);

  if (error) return error;

  await updateGroupMemberAddMode(sock, jid, body.mode);

  return ok(c, null, "Group member add mode updated");
});

export const updateEphemeral = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;
  const body = await c.req.json();
  const error = requireFields(c, body, ["expirationSeconds"]);

  if (error) return error;

  await toggleGroupEphemeral(sock, jid, body.expirationSeconds);

  return ok(c, null, "Group ephemeral messages updated");
});

export const leave = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;

  await leaveGroup(sock, jid);

  return ok(c, null, "Left group");
});

export const getMetadata = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;
  const metadata = await getGroupMetadata(sock, jid);

  return metadata ? ok(c, metadata) : fail(c, "Failed to fetch group metadata", 404, "NOT_FOUND");
});

export const getAllGroups = withSocket(async (c, sock) => {
  const groups = await getAllParticipatingGroups(sock);

  return groups ? ok(c, groups) : fail(c, "Failed to fetch participating groups", 500);
});

export const getInviteLink = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;
  const link = await getGroupInviteLink(sock, jid);

  return link ? ok(c, { link }) : fail(c, "Failed to get group invite link", 500);
});

export const revokeInviteLink = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;
  const link = await revokeGroupInviteLink(sock, jid);

  return link ? ok(c, { link }, "Invite link revoked") : fail(c, "Failed to revoke invite link", 500);
});

export const joinByCode = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["code"]);

  if (error) return error;

  const jid = await joinGroupByInviteCode(sock, body.code);

  return jid ? ok(c, { jid }, "Joined group") : fail(c, "Failed to join group", 500);
});

export const inviteInfo = withSocket(async (c, sock) => {
  const code = c.req.param("code")!;
  const metadata = await getGroupInviteInfo(sock, code);

  return metadata ? ok(c, metadata) : fail(c, "Failed to get invite info", 404, "NOT_FOUND");
});

export const listJoinRequests = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;
  const requests = await listGroupJoinRequests(sock, jid);

  return requests ? ok(c, requests) : fail(c, "Failed to list join requests", 500);
});

export const updateJoinRequests = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;
  const body = await c.req.json();
  const error = requireFields(c, body, ["participants", "action"]);

  if (error) return error;

  const result = await updateGroupJoinRequests(sock, jid, body.participants, body.action);

  return ok(c, result, "Join requests updated");
});
