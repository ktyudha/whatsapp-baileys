import type { WAMessage } from "@whiskeysockets/baileys";

export function getMessageText(message: WAMessage): string | undefined {
  const content = message.message;

  return (
    content?.conversation ??
    content?.extendedTextMessage?.text ??
    content?.imageMessage?.caption ??
    content?.videoMessage?.caption ??
    content?.documentMessage?.caption ??
    undefined
  );
}

export function getQuotedStanzaId(message: WAMessage): string | undefined {
  const content = message.message;

  return (
    content?.extendedTextMessage?.contextInfo?.stanzaId ??
    content?.imageMessage?.contextInfo?.stanzaId ??
    content?.videoMessage?.contextInfo?.stanzaId ??
    content?.documentMessage?.contextInfo?.stanzaId ??
    content?.audioMessage?.contextInfo?.stanzaId ??
    content?.stickerMessage?.contextInfo?.stanzaId ??
    undefined
  );
}

export type IncomingMediaType = "image" | "video" | "audio" | "document" | "sticker";

export function getMessageMediaType(message: WAMessage): IncomingMediaType | undefined {
  const content = message.message;

  if (content?.imageMessage) return "image";
  if (content?.videoMessage) return "video";
  if (content?.audioMessage) return "audio";
  if (content?.documentMessage) return "document";
  if (content?.stickerMessage) return "sticker";

  return undefined;
}

export type IncomingLocation = {
  latitude: number;
  longitude: number;
  isLive: boolean;
  accuracyInMeters?: number;
  address?: string;
  name?: string;
};

export function getMessageLocation(message: WAMessage): IncomingLocation | undefined {
  const content = message.message;

  const location = content?.locationMessage;

  if (location?.degreesLatitude != null && location?.degreesLongitude != null) {
    return {
      latitude: location.degreesLatitude,
      longitude: location.degreesLongitude,
      isLive: Boolean(location.isLive),
      accuracyInMeters: location.accuracyInMeters ?? undefined,
      address: location.address ?? undefined,
      name: location.name ?? undefined,
    };
  }

  const liveLocation = content?.liveLocationMessage;

  if (liveLocation?.degreesLatitude != null && liveLocation?.degreesLongitude != null) {
    return {
      latitude: liveLocation.degreesLatitude,
      longitude: liveLocation.degreesLongitude,
      isLive: true,
      accuracyInMeters: liveLocation.accuracyInMeters ?? undefined,
    };
  }

  return undefined;
}
