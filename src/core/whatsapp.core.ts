import makeWASocket, {
  Browsers,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  makeCacheableSignalKeyStore,
  type WASocket,
} from "@whiskeysockets/baileys";

import env from "@/config/env.config";
import { log, logger } from "@core/helpers/index.helper";
import {
  getCachedGroupMetadata,
  getCachedMessage,
  msgRetryCounterCache,
} from "@core/whatsapp-cache.core";
import { loadSession } from "@services/whatsapp/authentication/session-management.service";
import { setActiveSocket } from "@core/whatsapp-socket.core";

export type WhatsAppContext = {
  saveCreds: () => Promise<void>;
  reconnect: () => Promise<unknown>;
};

export type WhatsAppEvents = (sock: WASocket, ctx: WhatsAppContext) => void;

async function getVersion() {
  const { version, isLatest, error } = await fetchLatestBaileysVersion();

  if (error) {
    log.warn("WhatsApp: failed to fetch latest version, using bundled version", {
      version: version.join("."),
      err: error,
    });
  } else {
    log.info(`WhatsApp: using version ${version.join(".")}`, { isLatest });
  }

  return version;
}

export default async function createWhatsApp(
  events: WhatsAppEvents,
): Promise<WASocket | undefined> {
  try {
    const { state, saveCreds } = await loadSession();
    const version = await getVersion();

    const sock = makeWASocket({
      version,
      logger,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      browser: Browsers[env.WA_BROWSER_PLATFORM](env.APP_NAME),
      markOnlineOnConnect: env.WA_MARK_ONLINE_ON_CONNECT,
      syncFullHistory: env.WA_SYNC_FULL_HISTORY,
      msgRetryCounterCache,
      maxMsgRetryCount: env.WA_MAX_MSG_RETRY_COUNT,
      connectTimeoutMs: env.WA_CONNECT_TIMEOUT_MS,
      defaultQueryTimeoutMs: env.WA_QUERY_TIMEOUT_MS,
      keepAliveIntervalMs: env.WA_KEEP_ALIVE_INTERVAL_MS,
      shouldIgnoreJid: (jid) => env.WA_IGNORE_BROADCAST && Boolean(isJidBroadcast(jid)),
      getMessage: getCachedMessage,
      cachedGroupMetadata: getCachedGroupMetadata,
    });

    events(sock, {
      saveCreds,
      reconnect: () => createWhatsApp(events),
    });

    setActiveSocket(sock);

    log.info("WhatsApp: socket initialized", {
      browser: `${env.WA_BROWSER_PLATFORM}/${env.APP_NAME}`,
      markOnlineOnConnect: env.WA_MARK_ONLINE_ON_CONNECT,
      syncFullHistory: env.WA_SYNC_FULL_HISTORY,
    });

    return sock;
  } catch (error) {
    log.error("WhatsApp: failed to initialize socket", { err: error });
  }
}
