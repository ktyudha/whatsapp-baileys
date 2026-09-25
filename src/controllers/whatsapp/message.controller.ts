import type { WAMessageKey } from "@whiskeysockets/baileys";

import { fail, ok, requireFields, withSocket } from "@core/helpers/index.helper";
import {
  deleteMessage,
  editTextMessage,
  sendTextMessage,
} from "@services/whatsapp/message/send-message.service";
import { sendPoll } from "@services/whatsapp/message/poll-message.service";

export const sendText = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "text"]);

  if (error) return error;

  const message = await sendTextMessage(sock, body.jid, body.text);

  return message ? ok(c, message, "Message sent") : fail(c, "Failed to send message", 500);
});

export const remove = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "key"]);

  if (error) return error;

  const message = await deleteMessage(sock, body.jid, body.key as WAMessageKey);

  return message ? ok(c, message, "Message deleted") : fail(c, "Failed to delete message", 500);
});

export const edit = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "key", "text"]);

  if (error) return error;

  const message = await editTextMessage(sock, body.jid, body.key as WAMessageKey, body.text);

  return message ? ok(c, message, "Message edited") : fail(c, "Failed to edit message", 500);
});

export const sendPollMessage = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["jid", "poll"]);

  if (error) return error;

  const message = await sendPoll(sock, body.jid, body.poll);

  return message ? ok(c, message, "Poll sent") : fail(c, "Failed to send poll", 500);
});
