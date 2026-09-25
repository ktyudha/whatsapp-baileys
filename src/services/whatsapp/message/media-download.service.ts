import {
  downloadMediaMessage,
  type WAMessage,
  type WASocket,
} from "@whiskeysockets/baileys";

import { getMessageMediaType, type IncomingMediaType, log, logger } from "@core/helpers/index.helper";

export type DownloadedMedia = {
  type: IncomingMediaType;
  buffer: Buffer;
  mimetype: string;
  fileName?: string;
};

export async function downloadIncomingMedia(
  sock: WASocket,
  message: WAMessage,
): Promise<DownloadedMedia | undefined> {
  const type = getMessageMediaType(message);

  if (!type) return;

  try {
    const buffer = await downloadMediaMessage(message, "buffer", {}, {
      logger,
      reuploadRequest: sock.updateMediaMessage,
    });

    const content = message.message?.[`${type}Message` as const];
    const mimetype = content?.mimetype || "application/octet-stream";
    const fileName =
      type === "document" ? message.message?.documentMessage?.fileName ?? undefined : undefined;

    return { type, buffer, mimetype, fileName };
  } catch (error) {
    log.error("WhatsApp: failed to download incoming media", {
      id: message.key.id,
      type,
      err: error,
    });
  }
}
