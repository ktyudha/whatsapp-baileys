import { fail, ok, requireFields, withSocket } from "@core/helpers/index.helper";
import { deleteBroadcastList, sendToBroadcastList } from "@services/whatsapp/broadcast/broadcast-list.service";
import { postTextStatus } from "@services/whatsapp/broadcast/status.service";

export const postStatus = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["text", "statusJidList"]);

  if (error) return error;

  const message = await postTextStatus(sock, body.text, {
    statusJidList: body.statusJidList,
    backgroundColor: body.backgroundColor,
    font: body.font,
  });

  return message ? ok(c, message, "Status posted") : fail(c, "Failed to post status", 500);
});

export const sendToList = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["broadcastJid", "content"]);

  if (error) return error;

  const message = await sendToBroadcastList(sock, body.broadcastJid, body.content);

  return message ? ok(c, message, "Sent to broadcast list") : fail(c, "Failed to send", 500);
});

export const deleteList = withSocket(async (c, sock) => {
  const jid = c.req.param("jid")!;

  await deleteBroadcastList(sock, jid);

  return ok(c, null, "Broadcast list deleted");
});
