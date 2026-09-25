import type { WAMessageKey, WAPresence } from "@whiskeysockets/baileys";

import { fail, ok, requireFields, withSocket } from "@core/helpers/index.helper";
import {
  archiveChat,
  deleteChat,
  markChatRead,
  muteChat,
  pinChat,
} from "@services/whatsapp/chat/manage-chat.service";
import { subscribeToPresence, updatePresence } from "@services/whatsapp/chat/presence.service";

export const markRead = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["keys"]);

  if (error) return error;

  await markChatRead(sock, body.keys as WAMessageKey[]);

  return ok(c, null, "Chat marked as read");
});

export const archive = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid"]);

  if (error) return error;

  await archiveChat(sock, body.jid, body.archive ?? true);

  return ok(c, null, "Chat archive updated");
});

export const mute = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid"]);

  if (error) return error;

  await muteChat(sock, body.jid, body.durationMs ?? null);

  return ok(c, null, "Chat mute updated");
});

export const pin = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid"]);

  if (error) return error;

  await pinChat(sock, body.jid, body.pin ?? true);

  return ok(c, null, "Chat pin updated");
});

export const remove = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "lastMessageTimestamp"]);

  if (error) return error;

  await deleteChat(sock, body.jid, body.lastMessageTimestamp);

  return ok(c, null, "Chat deleted");
});

export const subscribePresence = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid"]);

  if (error) return error;

  await subscribeToPresence(sock, body.jid);

  return ok(c, null, "Subscribed to presence");
});

export const sendPresence = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "presence"]);

  if (error) return error;

  await updatePresence(sock, body.jid, body.presence as WAPresence);

  return ok(c, null, "Presence updated");
});
