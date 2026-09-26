import type { RouteHandler } from "@hono/zod-openapi";

import { fail, ok, withSocket } from "@core/helpers/index.helper";
import type {
  DeleteListRoute,
  PostStatusRoute,
  SendToListRoute,
} from "@routes/v1/broadcast/broadcast.routes";
import { deleteBroadcastList, sendToBroadcastList } from "@services/whatsapp/broadcast/broadcast-list.service";
import { postTextStatus } from "@services/whatsapp/broadcast/status.service";

export const postStatus: RouteHandler<PostStatusRoute> = withSocket(async (c, sock) => {
  const { text, statusJidList, backgroundColor, font } = c.req.valid("json");

  const message = await postTextStatus(sock, text, { statusJidList, backgroundColor, font });

  return message ? ok(c, message, "Status posted") : fail(c, "Failed to post status", 500);
});

export const sendToList: RouteHandler<SendToListRoute> = withSocket(async (c, sock) => {
  const { broadcastJid, content } = c.req.valid("json");

  const message = await sendToBroadcastList(sock, broadcastJid, content);

  return message ? ok(c, message, "Sent to broadcast list") : fail(c, "Failed to send", 500);
});

export const deleteList: RouteHandler<DeleteListRoute> = withSocket(async (c, sock) => {
  const { jid } = c.req.valid("param");

  await deleteBroadcastList(sock, jid);

  return ok(c, null, "Broadcast list deleted");
});
