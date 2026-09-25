import type { WASocket } from "@whiskeysockets/baileys";

import type { WhatsAppContext } from "@core/whatsapp.core";
import { cacheMessages, refreshGroupMetadata } from "@core/whatsapp-cache.core";
import env from "@/config/env.config";
import { handleDisconnect } from "@services/whatsapp/authentication/disconnect.service";
import { handlePairingCode } from "@services/whatsapp/authentication/pairing-code.service";
import { handleQrCode } from "@services/whatsapp/authentication/qrcode.service";
import { handleConnectionOpen } from "@services/whatsapp/authentication/session-management.service";
import { handleIncomingMessages } from "@services/whatsapp/message/incoming-message.service";
import { handlePresenceUpdate } from "@services/whatsapp/chat/presence.service";
import { handleIncomingCalls } from "@services/whatsapp/call/call.service";
import { handlePollVoteUpdates } from "@services/whatsapp/message/poll-message.service";

export default function whatsappEvents(sock: WASocket, ctx: WhatsAppContext) {
  sock.ev.on("creds.update", ctx.saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      if (env.WA_PAIRING_NUMBER) {
        handlePairingCode(sock, env.WA_PAIRING_NUMBER);
      } else {
        handleQrCode(qr);
      }
    }

    if (connection === "open") handleConnectionOpen(sock);
    if (connection === "close") handleDisconnect(lastDisconnect?.error, ctx.reconnect);
  });

  sock.ev.on("messages.upsert", (event) => {
    cacheMessages(event);
    handleIncomingMessages(sock, event);
  });

  sock.ev.on("groups.update", (updates) => {
    for (const { id } of updates) if (id) refreshGroupMetadata(sock, id);
  });

  sock.ev.on("group-participants.update", ({ id }) => refreshGroupMetadata(sock, id));

  sock.ev.on("presence.update", handlePresenceUpdate);

  sock.ev.on("call", (calls) => handleIncomingCalls(sock, calls));

  sock.ev.on("messages.update", (updates) => handlePollVoteUpdates(sock, updates));
}
