import type { WAMessageKey, WASocket } from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";

export async function markChatRead(sock: WASocket, keys: WAMessageKey[]) {
  try {
    await sock.readMessages(keys);

    log.debug("WhatsApp: chat marked as read", { count: keys.length });
  } catch (error) {
    log.error("WhatsApp: failed to mark chat as read", { err: error });
  }
}

export async function archiveChat(sock: WASocket, jid: string, archive = true) {
  try {
    await sock.chatModify({ archive, lastMessages: [] }, jid);

    log.info("WhatsApp: chat archive updated", { jid, archive });
  } catch (error) {
    log.error("WhatsApp: failed to update chat archive", { jid, err: error });
  }
}

export async function muteChat(sock: WASocket, jid: string, durationMs: number | null) {
  try {
    await sock.chatModify({ mute: durationMs }, jid);

    log.info("WhatsApp: chat mute updated", { jid, durationMs });
  } catch (error) {
    log.error("WhatsApp: failed to update chat mute", { jid, err: error });
  }
}

export async function pinChat(sock: WASocket, jid: string, pin = true) {
  try {
    await sock.chatModify({ pin }, jid);

    log.info("WhatsApp: chat pin updated", { jid, pin });
  } catch (error) {
    log.error("WhatsApp: failed to update chat pin", { jid, err: error });
  }
}

export async function deleteChat(sock: WASocket, jid: string, lastMessageTimestamp: number) {
  try {
    await sock.chatModify(
      {
        delete: true,
        lastMessages: [{ key: { remoteJid: jid, fromMe: false, id: "" }, messageTimestamp: lastMessageTimestamp }],
      },
      jid,
    );

    log.info("WhatsApp: chat deleted", { jid });
  } catch (error) {
    log.error("WhatsApp: failed to delete chat", { jid, err: error });
  }
}
