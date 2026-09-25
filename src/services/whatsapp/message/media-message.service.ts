import type { WAMediaUpload, WASocket } from "@whiskeysockets/baileys";

import { sendMessage } from "./send-message.service";

export async function sendImageMessage(
  sock: WASocket,
  jid: string,
  image: WAMediaUpload,
  caption?: string,
) {
  return sendMessage(sock, jid, { image, caption });
}

export async function sendVideoMessage(
  sock: WASocket,
  jid: string,
  video: WAMediaUpload,
  caption?: string,
) {
  return sendMessage(sock, jid, { video, caption });
}

export async function sendAudioMessage(
  sock: WASocket,
  jid: string,
  audio: WAMediaUpload,
  mimetype = "audio/mp4",
) {
  return sendMessage(sock, jid, { audio, mimetype });
}

export async function sendDocumentMessage(
  sock: WASocket,
  jid: string,
  document: WAMediaUpload,
  fileName: string,
  mimetype = "application/octet-stream",
) {
  return sendMessage(sock, jid, { document, fileName, mimetype });
}

export async function sendStickerMessage(sock: WASocket, jid: string, sticker: WAMediaUpload) {
  return sendMessage(sock, jid, { sticker });
}
