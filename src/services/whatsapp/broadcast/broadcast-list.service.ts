import type { AnyMessageContent, WASocket } from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";
import { sendMessage } from "@services/whatsapp/message/send-message.service";

export async function sendToBroadcastList(
  sock: WASocket,
  broadcastJid: string,
  content: AnyMessageContent,
) {
  return sendMessage(sock, broadcastJid, content);
}

export async function deleteBroadcastList(sock: WASocket, broadcastJid: string) {
  try {
    await sock.chatModify({ delete: true, lastMessages: [] }, broadcastJid);

    log.info("WhatsApp: broadcast list deleted", { jid: broadcastJid });
  } catch (error) {
    log.error("WhatsApp: failed to delete broadcast list", { jid: broadcastJid, err: error });
  }
}
