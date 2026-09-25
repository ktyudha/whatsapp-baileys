import { fail, ok, requireFields, withSocket } from "@core/helpers/index.helper";
import {
  blockContact,
  getBlockedContacts,
  getPrivacySettings,
  unblockContact,
  updateCallPrivacy,
  updateDefaultDisappearingMode,
  updateGroupsAddPrivacy,
  updateLastSeenPrivacy,
  updateMessagesPrivacy,
  updateOnlinePrivacy,
  updateProfilePicturePrivacy,
  updateReadReceiptsPrivacy,
  updateStatusPrivacy,
} from "@services/whatsapp/privacy/privacy.service";

export const block = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid"]);

  if (error) return error;

  await blockContact(sock, body.jid);

  return ok(c, null, "Contact blocked");
});

export const unblock = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid"]);

  if (error) return error;

  await unblockContact(sock, body.jid);

  return ok(c, null, "Contact unblocked");
});

export const getSettings = withSocket(async (c, sock) => {
  const settings = await getPrivacySettings(sock, c.req.query("force") === "true");

  return settings ? ok(c, settings) : fail(c, "Failed to fetch privacy settings", 500);
});

export const getBlocklist = withSocket(async (c, sock) => {
  const blocklist = await getBlockedContacts(sock);

  return blocklist ? ok(c, blocklist) : fail(c, "Failed to fetch blocklist", 500);
});

export const updateLastSeen = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["value"]);

  if (error) return error;

  await updateLastSeenPrivacy(sock, body.value);

  return ok(c, null, "Last seen privacy updated");
});

export const updateOnline = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["value"]);

  if (error) return error;

  await updateOnlinePrivacy(sock, body.value);

  return ok(c, null, "Online privacy updated");
});

export const updateProfilePicture = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["value"]);

  if (error) return error;

  await updateProfilePicturePrivacy(sock, body.value);

  return ok(c, null, "Profile picture privacy updated");
});

export const updateStatus = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["value"]);

  if (error) return error;

  await updateStatusPrivacy(sock, body.value);

  return ok(c, null, "Status privacy updated");
});

export const updateReadReceipts = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["value"]);

  if (error) return error;

  await updateReadReceiptsPrivacy(sock, body.value);

  return ok(c, null, "Read receipts privacy updated");
});

export const updateGroupsAdd = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["value"]);

  if (error) return error;

  await updateGroupsAddPrivacy(sock, body.value);

  return ok(c, null, "Groups add privacy updated");
});

export const updateCalls = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["value"]);

  if (error) return error;

  await updateCallPrivacy(sock, body.value);

  return ok(c, null, "Call privacy updated");
});

export const updateMessages = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["value"]);

  if (error) return error;

  await updateMessagesPrivacy(sock, body.value);

  return ok(c, null, "Messages privacy updated");
});

export const updateDisappearingMode = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["durationSeconds"]);

  if (error) return error;

  await updateDefaultDisappearingMode(sock, body.durationSeconds);

  return ok(c, null, "Default disappearing mode updated");
});
