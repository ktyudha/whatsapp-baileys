import type {
  AnyMessageContent,
  MiscMessageGenerationOptions,
  WAMessage,
  WAMessageKey,
  WASocket,
} from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";

export async function sendMessage(
  sock: WASocket,
  jid: string,
  content: AnyMessageContent,
  options?: MiscMessageGenerationOptions,
): Promise<WAMessage | undefined> {
  try {
    const message = await sock.sendMessage(jid, content, options);

    log.info("WhatsApp: message sent", { jid, id: message?.key.id });

    return message;
  } catch (error) {
    log.error("WhatsApp: failed to send message", { jid, err: error });
  }
}

export async function sendTextMessage(sock: WASocket, jid: string, text: string) {
  return sendMessage(sock, jid, { text });
}

export async function replyTextMessage(
  sock: WASocket,
  jid: string,
  text: string,
  quoted: WAMessage,
) {
  return sendMessage(sock, jid, { text }, { quoted });
}

export async function deleteMessage(sock: WASocket, jid: string, key: WAMessageKey) {
  return sendMessage(sock, jid, { delete: key });
}

export async function editTextMessage(
  sock: WASocket,
  jid: string,
  key: WAMessageKey,
  text: string,
) {
  return sendMessage(sock, jid, { text, edit: key });
}
