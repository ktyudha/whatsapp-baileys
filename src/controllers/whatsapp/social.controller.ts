import type { WAMessageKey } from "@whiskeysockets/baileys";

import { fail, ok, requireFields, withSocket } from "@core/helpers/index.helper";
import {
  pinMessage,
  reactToMessage,
  removeReaction,
  sendContactMessage,
  sendGroupInviteMessage,
  sendLocationMessage,
  unpinMessage,
} from "@services/whatsapp/message/social-message.service";

export const react = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "key", "emoji"]);

  if (error) return error;

  const message = await reactToMessage(sock, body.jid, body.key as WAMessageKey, body.emoji);

  return message ? ok(c, message, "Reaction sent") : fail(c, "Failed to send reaction", 500);
});

export const unreact = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "key"]);

  if (error) return error;

  const message = await removeReaction(sock, body.jid, body.key as WAMessageKey);

  return message ? ok(c, message, "Reaction removed") : fail(c, "Failed to remove reaction", 500);
});

export const sendLocation = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "latitude", "longitude"]);

  if (error) return error;

  const message = await sendLocationMessage(sock, body.jid, {
    degreesLatitude: body.latitude,
    degreesLongitude: body.longitude,
  });

  return message ? ok(c, message, "Location sent") : fail(c, "Failed to send location", 500);
});

export const sendContact = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "contacts"]);

  if (error) return error;

  const message = await sendContactMessage(sock, body.jid, body.contacts, body.displayName);

  return message ? ok(c, message, "Contact sent") : fail(c, "Failed to send contact", 500);
});

export const sendGroupInvite = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "groupInvite"]);

  if (error) return error;

  const message = await sendGroupInviteMessage(sock, body.jid, body.groupInvite);

  return message ? ok(c, message, "Group invite sent") : fail(c, "Failed to send group invite", 500);
});

export const pin = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "key"]);

  if (error) return error;

  const message = await pinMessage(sock, body.jid, body.key as WAMessageKey, body.durationSeconds);

  return message ? ok(c, message, "Message pinned") : fail(c, "Failed to pin message", 500);
});

export const unpin = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "key"]);

  if (error) return error;

  const message = await unpinMessage(sock, body.jid, body.key as WAMessageKey);

  return message ? ok(c, message, "Message unpinned") : fail(c, "Failed to unpin message", 500);
});
