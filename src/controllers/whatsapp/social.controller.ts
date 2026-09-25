import type { RouteHandler } from "@hono/zod-openapi";
import type { WAMessageKey } from "@whiskeysockets/baileys";

import { fail, ok, withSocket } from "@core/helpers/index.helper";
import type {
  PinMessageRoute,
  ReactRoute,
  SendContactRoute,
  SendGroupInviteRoute,
  SendLocationRoute,
  UnpinMessageRoute,
  UnreactRoute,
} from "@routes/whatsapp/social.routes";
import {
  pinMessage,
  reactToMessage,
  removeReaction,
  sendContactMessage,
  sendGroupInviteMessage,
  sendLocationMessage,
  unpinMessage,
} from "@services/whatsapp/message/social-message.service";

export const react: RouteHandler<ReactRoute> = withSocket(async (c, sock) => {
  const { jid, key, emoji } = c.req.valid("json");

  const message = await reactToMessage(sock, jid, key as WAMessageKey, emoji);

  return message ? ok(c, message, "Reaction sent") : fail(c, "Failed to send reaction", 500);
});

export const unreact: RouteHandler<UnreactRoute> = withSocket(async (c, sock) => {
  const { jid, key } = c.req.valid("json");

  const message = await removeReaction(sock, jid, key as WAMessageKey);

  return message ? ok(c, message, "Reaction removed") : fail(c, "Failed to remove reaction", 500);
});

export const sendLocation: RouteHandler<SendLocationRoute> = withSocket(async (c, sock) => {
  const { jid, latitude, longitude } = c.req.valid("json");

  const message = await sendLocationMessage(sock, jid, {
    degreesLatitude: latitude,
    degreesLongitude: longitude,
  });

  return message ? ok(c, message, "Location sent") : fail(c, "Failed to send location", 500);
});

export const sendContact: RouteHandler<SendContactRoute> = withSocket(async (c, sock) => {
  const { jid, contacts, displayName } = c.req.valid("json");

  const message = await sendContactMessage(sock, jid, contacts, displayName);

  return message ? ok(c, message, "Contact sent") : fail(c, "Failed to send contact", 500);
});

export const sendGroupInvite: RouteHandler<SendGroupInviteRoute> = withSocket(async (c, sock) => {
  const { jid, groupInvite } = c.req.valid("json");

  const message = await sendGroupInviteMessage(sock, jid, groupInvite);

  return message ? ok(c, message, "Group invite sent") : fail(c, "Failed to send group invite", 500);
});

export const pin: RouteHandler<PinMessageRoute> = withSocket(async (c, sock) => {
  const { jid, key, durationSeconds } = c.req.valid("json");

  const message = await pinMessage(sock, jid, key as WAMessageKey, durationSeconds);

  return message ? ok(c, message, "Message pinned") : fail(c, "Failed to pin message", 500);
});

export const unpin: RouteHandler<UnpinMessageRoute> = withSocket(async (c, sock) => {
  const { jid, key } = c.req.valid("json");

  const message = await unpinMessage(sock, jid, key as WAMessageKey);

  return message ? ok(c, message, "Message unpinned") : fail(c, "Failed to unpin message", 500);
});
