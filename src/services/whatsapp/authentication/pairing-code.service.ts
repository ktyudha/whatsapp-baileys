import type { WASocket } from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";

const requestedSockets = new WeakSet<WASocket>();

export async function handlePairingCode(sock: WASocket, phoneNumber: string) {
  if (requestedSockets.has(sock) || sock.authState.creds.registered) return;

  requestedSockets.add(sock);

  try {
    const code = await sock.requestPairingCode(phoneNumber);

    log.info(`WhatsApp: pairing code for ${phoneNumber} is ${code}`);
  } catch (error) {
    requestedSockets.delete(sock);

    log.error("WhatsApp: failed to request pairing code", {
      phoneNumber,
      err: error,
    });
  }
}
