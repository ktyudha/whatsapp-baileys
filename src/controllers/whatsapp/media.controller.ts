import { fail, ok, withSocket } from "@core/helpers/index.helper";
import { resolveMediaUpload } from "@core/helpers/media-upload.helper";
import {
  sendAudioMessage,
  sendDocumentMessage,
  sendImageMessage,
  sendStickerMessage,
  sendVideoMessage,
} from "@services/whatsapp/message/media-message.service";

export const sendImage = withSocket(async (c, sock) => {
  const upload = await resolveMediaUpload(c);

  if (!upload?.jid) return fail(c, 'Field "jid" and "url" or "file" are required', 400, "VALIDATION_ERROR");

  const message = await sendImageMessage(sock, upload.jid, upload.media, upload.caption);

  return message ? ok(c, message, "Image sent") : fail(c, "Failed to send image", 500);
});

export const sendVideo = withSocket(async (c, sock) => {
  const upload = await resolveMediaUpload(c);

  if (!upload?.jid) return fail(c, 'Field "jid" and "url" or "file" are required', 400, "VALIDATION_ERROR");

  const message = await sendVideoMessage(sock, upload.jid, upload.media, upload.caption);

  return message ? ok(c, message, "Video sent") : fail(c, "Failed to send video", 500);
});

export const sendAudio = withSocket(async (c, sock) => {
  const upload = await resolveMediaUpload(c);

  if (!upload?.jid) return fail(c, 'Field "jid" and "url" or "file" are required', 400, "VALIDATION_ERROR");

  const message = await sendAudioMessage(sock, upload.jid, upload.media, upload.mimetype);

  return message ? ok(c, message, "Audio sent") : fail(c, "Failed to send audio", 500);
});

export const sendDocument = withSocket(async (c, sock) => {
  const upload = await resolveMediaUpload(c);

  if (!upload?.jid) return fail(c, 'Field "jid" and "url" or "file" are required', 400, "VALIDATION_ERROR");
  if (!upload.fileName) return fail(c, 'Field "fileName" is required', 400, "VALIDATION_ERROR");

  const message = await sendDocumentMessage(
    sock,
    upload.jid,
    upload.media,
    upload.fileName,
    upload.mimetype,
  );

  return message ? ok(c, message, "Document sent") : fail(c, "Failed to send document", 500);
});

export const sendSticker = withSocket(async (c, sock) => {
  const upload = await resolveMediaUpload(c);

  if (!upload?.jid) return fail(c, 'Field "jid" and "url" or "file" are required', 400, "VALIDATION_ERROR");

  const message = await sendStickerMessage(sock, upload.jid, upload.media);

  return message ? ok(c, message, "Sticker sent") : fail(c, "Failed to send sticker", 500);
});
