import type { WAMessage, WASocket } from "@whiskeysockets/baileys";

import env from "@/config/env.config";
import {
  getMessageLocation,
  getMessageText,
  getQuotedStanzaId,
  isPrivateChat,
  log,
} from "@core/helpers/index.helper";
import { getRedirectReplyMapping, setRedirectReplyMapping } from "@core/whatsapp-cache.core";
import { downloadIncomingMedia } from "./media-download.service";
import {
  sendAudioMessage,
  sendDocumentMessage,
  sendImageMessage,
  sendStickerMessage,
  sendVideoMessage,
} from "./media-message.service";
import { sendMessage, sendTextMessage } from "./send-message.service";

export function isRedirectEnabled(): boolean {
  return Boolean(env.WA_REDIRECT_GROUP_ID);
}

export function isFromRedirectGroup(jid: string | undefined): boolean {
  return isRedirectEnabled() && jid === env.WA_REDIRECT_GROUP_ID;
}

export function shouldForwardToGroup(jid: string | undefined): boolean {
  return isRedirectEnabled() && isPrivateChat(jid);
}

function buildSenderHeader(message: WAMessage, title: string): string {
  const realJid = message.key.remoteJidAlt || message.key.remoteJid;
  const senderName = message.pushName || realJid;
  const senderNumber = realJid?.split("@")[0];

  return `*${title}*\n\n*Dari*: ${senderName}\n*Nomor*: +${senderNumber}`;
}

async function rememberMapping(senderJid: string, sentMessage: WAMessage | undefined) {
  if (!sentMessage?.key.id) return;

  setRedirectReplyMapping(sentMessage.key.id, senderJid);
}

export async function forwardPrivateMessageToGroup(sock: WASocket, message: WAMessage) {
  const redirectGroupId = env.WA_REDIRECT_GROUP_ID;
  const senderJid = message.key.remoteJid;

  if (!redirectGroupId || !senderJid) return;

  const location = getMessageLocation(message);

  if (location) {
    await forwardLocationToGroup(sock, message, redirectGroupId, senderJid, location);
    return;
  }

  const media = await downloadIncomingMedia(sock, message);

  if (media) {
    await forwardMediaToGroup(sock, message, redirectGroupId, senderJid, media);
    return;
  }

  const text = getMessageText(message) || "(pesan tanpa teks / media)";
  const sentMessage = await sendTextMessage(
    sock,
    redirectGroupId,
    `${buildSenderHeader(message, "Pesan Masuk")}\n\n*Pesan*:\n${text}`,
  );

  await rememberMapping(senderJid, sentMessage);

  log.info("WhatsApp: private text message forwarded to redirect group", {
    senderJid,
    redirectGroupId,
  });
}

async function forwardMediaToGroup(
  sock: WASocket,
  message: WAMessage,
  redirectGroupId: string,
  senderJid: string,
  media: Awaited<ReturnType<typeof downloadIncomingMedia>>,
) {
  if (!media) return;

  const caption = `${buildSenderHeader(message, "Pesan Media")}\n\n*Tipe*: ${media.type.toUpperCase()}`;

  const headerMessage = await sendTextMessage(sock, redirectGroupId, caption);

  await rememberMapping(senderJid, headerMessage);

  let sentMessage: WAMessage | undefined;

  switch (media.type) {
    case "image":
      sentMessage = await sendImageMessage(sock, redirectGroupId, media.buffer);
      break;
    case "video":
      sentMessage = await sendVideoMessage(sock, redirectGroupId, media.buffer);
      break;
    case "audio":
      sentMessage = await sendAudioMessage(sock, redirectGroupId, media.buffer, media.mimetype);
      break;
    case "document":
      sentMessage = await sendDocumentMessage(
        sock,
        redirectGroupId,
        media.buffer,
        media.fileName || "file",
        media.mimetype,
      );
      break;
    case "sticker":
      sentMessage = await sendStickerMessage(sock, redirectGroupId, media.buffer);
      break;
  }

  await rememberMapping(senderJid, sentMessage);

  log.info("WhatsApp: private media message forwarded to redirect group", {
    senderJid,
    redirectGroupId,
    type: media.type,
  });
}

async function forwardLocationToGroup(
  sock: WASocket,
  message: WAMessage,
  redirectGroupId: string,
  senderJid: string,
  location: NonNullable<ReturnType<typeof getMessageLocation>>,
) {
  const title = location.isLive ? "Live Location" : "Location";
  const text =
    `${buildSenderHeader(message, title)}\n\n` +
    `Lat: ${location.latitude}\nLng: ${location.longitude}\n` +
    (location.accuracyInMeters ? `Accuracy: ${location.accuracyInMeters} m\n` : "") +
    (location.address ? `Address: ${location.address}\n` : "");

  const sentMessage = await sendMessage(sock, redirectGroupId, {
    location: {
      degreesLatitude: location.latitude,
      degreesLongitude: location.longitude,
    },
  });

  const headerMessage = await sendTextMessage(sock, redirectGroupId, text);
  await rememberMapping(senderJid, sentMessage);
  await rememberMapping(senderJid, headerMessage);

  log.info("WhatsApp: location forwarded to redirect group", {
    senderJid,
    redirectGroupId,
    isLive: location.isLive,
  });
}

export async function handleRedirectGroupReply(sock: WASocket, message: WAMessage) {
  const stanzaId = getQuotedStanzaId(message);

  if (!stanzaId) return;

  const senderJid = getRedirectReplyMapping(stanzaId);

  if (!senderJid) {
    log.warn("WhatsApp: quoted message has no known sender mapping", { stanzaId });
    return;
  }

  const media = await downloadIncomingMedia(sock, message);

  try {
    if (media) {
      await replyMediaToSender(sock, senderJid, media, getMessageText(message));
      return;
    }

    const replyText = getMessageText(message);

    if (!replyText) return;

    await sendTextMessage(sock, senderJid, replyText);
  } catch (error) {
    log.error("WhatsApp: failed to route group reply back to original sender", {
      senderJid,
      stanzaId,
      err: error,
    });
    return;
  }

  log.info("WhatsApp: group reply routed back to original sender", { senderJid, stanzaId });
}

async function replyMediaToSender(
  sock: WASocket,
  senderJid: string,
  media: NonNullable<Awaited<ReturnType<typeof downloadIncomingMedia>>>,
  caption: string | undefined,
) {
  switch (media.type) {
    case "image":
      await sendImageMessage(sock, senderJid, media.buffer, caption);
      break;
    case "video":
      await sendVideoMessage(sock, senderJid, media.buffer, caption);
      break;
    case "audio":
      await sendAudioMessage(sock, senderJid, media.buffer, media.mimetype);
      break;
    case "document":
      await sendDocumentMessage(sock, senderJid, media.buffer, media.fileName || "file", media.mimetype);
      break;
    case "sticker":
      await sendStickerMessage(sock, senderJid, media.buffer);
      break;
  }

  log.info("WhatsApp: group reply media routed back to original sender", {
    senderJid,
    type: media.type,
  });
}
