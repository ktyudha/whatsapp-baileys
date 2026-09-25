import type { RouteHandler } from "@hono/zod-openapi";
import type { WAMessageKey } from "@whiskeysockets/baileys";

import { ok, withSocket } from "@core/helpers/index.helper";
import type {
  ArchiveChatRoute,
  DeleteChatRoute,
  MarkReadRoute,
  MuteChatRoute,
  PinChatRoute,
  SendPresenceRoute,
  SubscribePresenceRoute,
} from "@routes/whatsapp/chat.routes";
import {
  archiveChat,
  deleteChat,
  markChatRead,
  muteChat,
  pinChat,
} from "@services/whatsapp/chat/manage-chat.service";
import { subscribeToPresence, updatePresence } from "@services/whatsapp/chat/presence.service";

export const markRead: RouteHandler<MarkReadRoute> = withSocket(async (c, sock) => {
  const { keys } = c.req.valid("json");

  await markChatRead(sock, keys as WAMessageKey[]);

  return ok(c, null, "Chat marked as read");
});

export const archive: RouteHandler<ArchiveChatRoute> = withSocket(async (c, sock) => {
  const { jid, archive: shouldArchive } = c.req.valid("json");

  await archiveChat(sock, jid, shouldArchive);

  return ok(c, null, "Chat archive updated");
});

export const mute: RouteHandler<MuteChatRoute> = withSocket(async (c, sock) => {
  const { jid, durationMs } = c.req.valid("json");

  await muteChat(sock, jid, durationMs ?? null);

  return ok(c, null, "Chat mute updated");
});

export const pin: RouteHandler<PinChatRoute> = withSocket(async (c, sock) => {
  const { jid, pin: shouldPin } = c.req.valid("json");

  await pinChat(sock, jid, shouldPin);

  return ok(c, null, "Chat pin updated");
});

export const remove: RouteHandler<DeleteChatRoute> = withSocket(async (c, sock) => {
  const { jid, lastMessageTimestamp } = c.req.valid("json");

  await deleteChat(sock, jid, lastMessageTimestamp);

  return ok(c, null, "Chat deleted");
});

export const subscribePresence: RouteHandler<SubscribePresenceRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("json");

  await subscribeToPresence(sock, jid);

  return ok(c, null, "Subscribed to presence");
});

export const sendPresence: RouteHandler<SendPresenceRoute> = withSocket(async (c, sock) => {
  const { jid, presence } = c.req.valid("json");

  await updatePresence(sock, jid, presence);

  return ok(c, null, "Presence updated");
});
