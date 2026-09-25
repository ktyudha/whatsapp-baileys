import type { WAMessage, WASocket } from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";
import env from "@/config/env.config";
import { sendMessage } from "./send-message.service";

export function isForwardSource(jid: string | undefined): boolean {
  if (!env.WA_FORWARD_ENABLED || !jid) return false;

  return env.WA_FORWARD_SOURCE_WHITELIST.includes(jid);
}

export async function forwardMessage(sock: WASocket, message: WAMessage) {
  const sourceJid = message.key.remoteJid;

  if (!env.WA_FORWARD_TARGET_JIDS.length) return;

  for (const targetJid of env.WA_FORWARD_TARGET_JIDS) {
    const forwarded = await sendMessage(sock, targetJid, { forward: message });

    if (forwarded) {
      log.info("WhatsApp: message forwarded", {
        sourceJid,
        targetJid,
        id: message.key.id,
      });
    }
  }
}
