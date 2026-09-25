import { DisconnectReason } from "@whiskeysockets/baileys";
import type { Boom } from "@hapi/boom";

import { log } from "@core/helpers/index.helper";
import env from "@/config/env.config";
import { setActiveSocket } from "@core/whatsapp-socket.core";
import { clearSession } from "./session-management.service";

export async function handleDisconnect(
  error: Error | undefined,
  reconnect: () => Promise<unknown>,
) {
  const statusCode = (error as Boom | undefined)?.output?.statusCode;
  const reason = statusCode ? DisconnectReason[statusCode] : undefined;
  const meta = { statusCode, reason, err: error };

  switch (statusCode) {
    case DisconnectReason.loggedOut:
    case DisconnectReason.badSession:
      log.warn("WhatsApp: session invalid, clearing and reconnecting", meta);
      await clearSession();
      return reconnect();

    case DisconnectReason.restartRequired:
      log.info("WhatsApp: restart required, reconnecting", meta);
      return reconnect();

    case DisconnectReason.connectionReplaced:
    case DisconnectReason.multideviceMismatch:
    case DisconnectReason.forbidden:
      log.error("WhatsApp: connection closed permanently, not reconnecting", meta);
      setActiveSocket(undefined);
      return;

    default:
      log.warn(
        `WhatsApp: connection closed, reconnecting in ${env.WA_RECONNECT_DELAY_MS}ms`,
        meta,
      );
      await Bun.sleep(env.WA_RECONNECT_DELAY_MS);
      return reconnect();
  }
}
