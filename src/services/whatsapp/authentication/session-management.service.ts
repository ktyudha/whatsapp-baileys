import { rm } from "node:fs/promises";
import { useMultiFileAuthState, type WASocket } from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";
import env from "@/config/env.config";

export async function loadSession() {
  log.debug("WhatsApp: loading session", { authDir: env.WA_AUTH_DIR });

  return useMultiFileAuthState(env.WA_AUTH_DIR);
}

export async function clearSession() {
  await rm(env.WA_AUTH_DIR, { recursive: true, force: true });

  log.warn("WhatsApp: session cleared", { authDir: env.WA_AUTH_DIR });
}

export function handleConnectionOpen(sock: WASocket) {
  log.info("WhatsApp: connection opened", {
    id: sock.user?.id,
    pushName: sock.user?.name,
  });
}
