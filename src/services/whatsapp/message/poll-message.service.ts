import {
  getAggregateVotesInPollMessage,
  type BaileysEventMap,
  type PollMessageOptions,
  type WASocket,
} from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";
import { getCachedMessage } from "@core/whatsapp-cache.core";
import { sendMessage } from "./send-message.service";

export async function sendPoll(sock: WASocket, jid: string, poll: PollMessageOptions) {
  return sendMessage(sock, jid, { poll });
}

export async function handlePollVoteUpdates(
  sock: WASocket,
  updates: BaileysEventMap["messages.update"],
) {
  for (const { key, update } of updates) {
    if (!update.pollUpdates) continue;

    const pollCreation = await getCachedMessage(key);

    if (!pollCreation) {
      log.warn("WhatsApp: poll creation message not cached, cannot aggregate votes", {
        id: key.id,
      });
      continue;
    }

    const result = getAggregateVotesInPollMessage(
      { message: pollCreation, pollUpdates: update.pollUpdates },
      sock.user?.id,
    );

    log.info("WhatsApp: poll votes updated", { id: key.id, result });
  }
}
