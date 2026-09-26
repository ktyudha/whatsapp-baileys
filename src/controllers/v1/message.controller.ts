import { fail, ok, withSocket } from "@core/helpers/index.helper";
import type {
  DeleteMessageRoute,
  EditMessageRoute,
  SendPollMessageRoute,
  SendTextMessageRoute,
} from "@routes/v1/message/message.routes";
import type { RouteHandler } from "@hono/zod-openapi";
import {
  deleteMessage,
  editTextMessage,
  sendTextMessage,
} from "@services/whatsapp/message/send-message.service";
import { sendPoll } from "@services/whatsapp/message/poll-message.service";

export const sendText: RouteHandler<SendTextMessageRoute> = withSocket(async (c, sock) => {
  const { jid, text } = c.req.valid("json");

  const message = await sendTextMessage(sock, jid, text);

  return message ? ok(c, message, "Message sent") : fail(c, "Failed to send message", 500);
});

export const remove: RouteHandler<DeleteMessageRoute> = withSocket(async (c, sock) => {
  const { jid, key } = c.req.valid("json");

  const message = await deleteMessage(sock, jid, key);

  return message ? ok(c, message, "Message deleted") : fail(c, "Failed to delete message", 500);
});

export const edit: RouteHandler<EditMessageRoute> = withSocket(async (c, sock) => {
  const { jid, key, text } = c.req.valid("json");

  const message = await editTextMessage(sock, jid, key, text);

  return message ? ok(c, message, "Message edited") : fail(c, "Failed to edit message", 500);
});

export const sendPollMessage: RouteHandler<SendPollMessageRoute> = withSocket(async (c, sock) => {
  const { jid, poll } = c.req.valid("json");

  const message = await sendPoll(sock, jid, poll);

  return message ? ok(c, message, "Poll sent") : fail(c, "Failed to send poll", 500);
});
