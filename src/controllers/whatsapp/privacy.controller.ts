import type { RouteHandler } from "@hono/zod-openapi";

import { fail, ok, withSocket } from "@core/helpers/index.helper";
import type {
  BlockContactRoute,
  GetBlocklistRoute,
  GetPrivacySettingsRoute,
  UnblockContactRoute,
  UpdateCallsRoute,
  UpdateDisappearingModeRoute,
  UpdateGroupsAddRoute,
  UpdateLastSeenRoute,
  UpdateMessagesRoute,
  UpdateOnlineRoute,
  UpdateProfilePictureRoute,
  UpdateReadReceiptsRoute,
  UpdateStatusRoute,
} from "@routes/whatsapp/privacy.routes";
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

export const block: RouteHandler<BlockContactRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("json");

  await blockContact(sock, jid);

  return ok(c, null, "Contact blocked");
});

export const unblock: RouteHandler<UnblockContactRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("json");

  await unblockContact(sock, jid);

  return ok(c, null, "Contact unblocked");
});

export const getSettings: RouteHandler<GetPrivacySettingsRoute> = withSocket(async (c, sock) => {
  const settings = await getPrivacySettings(sock, c.req.query("force") === "true");

  return settings ? ok(c, settings) : fail(c, "Failed to fetch privacy settings", 500);
});

export const getBlocklist: RouteHandler<GetBlocklistRoute> = withSocket(async (c, sock) => {
  const blocklist = await getBlockedContacts(sock);

  return blocklist ? ok(c, blocklist) : fail(c, "Failed to fetch blocklist", 500);
});

export const updateLastSeen: RouteHandler<UpdateLastSeenRoute> = withSocket(async (c, sock) => {
  const { value } = c.req.valid("json");

  await updateLastSeenPrivacy(sock, value);

  return ok(c, null, "Last seen privacy updated");
});

export const updateOnline: RouteHandler<UpdateOnlineRoute> = withSocket(async (c, sock) => {
  const { value } = c.req.valid("json");

  await updateOnlinePrivacy(sock, value);

  return ok(c, null, "Online privacy updated");
});

export const updateProfilePicture: RouteHandler<UpdateProfilePictureRoute> = withSocket(async (c, sock) => {
  const { value } = c.req.valid("json");

  await updateProfilePicturePrivacy(sock, value);

  return ok(c, null, "Profile picture privacy updated");
});

export const updateStatus: RouteHandler<UpdateStatusRoute> = withSocket(async (c, sock) => {
  const { value } = c.req.valid("json");

  await updateStatusPrivacy(sock, value);

  return ok(c, null, "Status privacy updated");
});

export const updateReadReceipts: RouteHandler<UpdateReadReceiptsRoute> = withSocket(async (c, sock) => {
  const { value } = c.req.valid("json");

  await updateReadReceiptsPrivacy(sock, value);

  return ok(c, null, "Read receipts privacy updated");
});

export const updateGroupsAdd: RouteHandler<UpdateGroupsAddRoute> = withSocket(async (c, sock) => {
  const { value } = c.req.valid("json");

  await updateGroupsAddPrivacy(sock, value);

  return ok(c, null, "Groups add privacy updated");
});

export const updateCalls: RouteHandler<UpdateCallsRoute> = withSocket(async (c, sock) => {
  const { value } = c.req.valid("json");

  await updateCallPrivacy(sock, value);

  return ok(c, null, "Call privacy updated");
});

export const updateMessages: RouteHandler<UpdateMessagesRoute> = withSocket(async (c, sock) => {
  const { value } = c.req.valid("json");

  await updateMessagesPrivacy(sock, value);

  return ok(c, null, "Messages privacy updated");
});

export const updateDisappearingMode: RouteHandler<UpdateDisappearingModeRoute> = withSocket(async (c, sock) => {
  const { durationSeconds } = c.req.valid("json");

  await updateDefaultDisappearingMode(sock, durationSeconds);

  return ok(c, null, "Default disappearing mode updated");
});
