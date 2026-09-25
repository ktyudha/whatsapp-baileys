import type { BaileysEventMap, WASocket } from "@whiskeysockets/baileys";

import { getMessageText, log } from "@core/helpers/index.helper";
import env from "@/config/env.config";
import { handleCommand, isCommandMessage } from "@services/whatsapp/command/command.service";
import { forwardMessage, isForwardSource } from "./forward-message.service";
import {
  forwardPrivateMessageToGroup,
  handleRedirectGroupReply,
  isFromRedirectGroup,
  shouldForwardToGroup,
} from "./forward-to-group.service";
import { replyTextMessage } from "./send-message.service";

export async function handleIncomingMessages(
  sock: WASocket,
  { messages, type }: BaileysEventMap["messages.upsert"],
) {
  if (type !== "notify") return;

  for (const message of messages) {
    const jid = message.key.remoteJid;

    if (message.key.fromMe || !jid) continue;

    log.info("WhatsApp: incoming message", { jid, id: message.key.id });
    log.debug("WhatsApp: incoming message payload", { message });

    if (isCommandMessage(getMessageText(message))) {
      await handleCommand(sock, message);
      continue;
    }

    if (isFromRedirectGroup(jid)) {
      await handleRedirectGroupReply(sock, message);
      continue;
    }

    if (isForwardSource(jid)) await forwardMessage(sock, message);

    if (shouldForwardToGroup(jid)) {
      await forwardPrivateMessageToGroup(sock, message);
      continue;
    }

    if (env.WA_AUTO_REPLY_ENABLED) {
      await replyTextMessage(sock, jid, env.WA_AUTO_REPLY_MESSAGE, message);
    }
  }
}
