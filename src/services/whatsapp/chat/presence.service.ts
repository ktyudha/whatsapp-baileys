import type { BaileysEventMap, WAPresence, WASocket } from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";

export async function subscribeToPresence(sock: WASocket, jid: string) {
  try {
    await sock.presenceSubscribe(jid);

    log.debug("WhatsApp: subscribed to presence", { jid });
  } catch (error) {
    log.error("WhatsApp: failed to subscribe to presence", { jid, err: error });
  }
}

export function handlePresenceUpdate({ id, presences }: BaileysEventMap["presence.update"]) {
  for (const [participant, data] of Object.entries(presences)) {
    log.debug("WhatsApp: presence update", {
      chatJid: id,
      participant,
      presence: data.lastKnownPresence,
      lastSeen: data.lastSeen,
    });
  }
}

export async function updatePresence(sock: WASocket, jid: string, presence: WAPresence) {
  try {
    await sock.sendPresenceUpdate(presence, jid);

    log.debug("WhatsApp: presence updated", { jid, presence });
  } catch (error) {
    log.error("WhatsApp: failed to update presence", { jid, presence, err: error });
  }
}

export const setTyping = (sock: WASocket, jid: string) =>
  updatePresence(sock, jid, "composing");

export const setRecording = (sock: WASocket, jid: string) =>
  updatePresence(sock, jid, "recording");

export const clearTyping = (sock: WASocket, jid: string) =>
  updatePresence(sock, jid, "paused");

export const setOnline = (sock: WASocket, jid: string) =>
  updatePresence(sock, jid, "available");

export const setOffline = (sock: WASocket, jid: string) =>
  updatePresence(sock, jid, "unavailable");
