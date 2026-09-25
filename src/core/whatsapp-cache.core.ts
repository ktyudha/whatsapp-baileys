import NodeCache from "@cacheable/node-cache";
import type {
  BaileysEventMap,
  CacheStore,
  GroupMetadata,
  proto,
  WAMessageKey,
  WASocket,
} from "@whiskeysockets/baileys";

export type CallState = {
  from: string;
  isVideo: boolean;
  offerAt: Date;
  acceptedAt?: Date;
};

import env from "@/config/env.config";
import { log } from "@core/helpers/index.helper";

export const msgRetryCounterCache = new NodeCache() as CacheStore;

const messageCache = new NodeCache<proto.IMessage>({
  stdTTL: env.WA_MESSAGE_CACHE_TTL_S,
  useClones: false,
});

const groupCache = new NodeCache<GroupMetadata>({
  stdTTL: env.WA_GROUP_CACHE_TTL_S,
  useClones: false,
});

const redirectReplyMapCache = new NodeCache<string>({
  stdTTL: env.WA_REDIRECT_MAP_TTL_S,
  useClones: false,
});

const callStateCache = new NodeCache<CallState>({
  stdTTL: 3600,
  useClones: false,
});

const messageCacheKey = (key: WAMessageKey) => `${key.remoteJid}:${key.id}`;

export async function getCachedMessage(key: WAMessageKey) {
  const message = messageCache.get(messageCacheKey(key));

  log.debug("WhatsApp: message cache lookup", {
    jid: key.remoteJid,
    id: key.id,
    hit: Boolean(message),
  });

  return message;
}

export function cacheMessages({ messages }: BaileysEventMap["messages.upsert"]) {
  for (const { key, message } of messages) {
    if (key.id && message) messageCache.set(messageCacheKey(key), message);
  }
}

export async function getCachedGroupMetadata(jid: string) {
  return groupCache.get(jid);
}

export async function refreshGroupMetadata(sock: WASocket, jid: string) {
  try {
    groupCache.set(jid, await sock.groupMetadata(jid));

    log.debug("WhatsApp: group metadata cached", { jid });
  } catch (error) {
    log.error("WhatsApp: failed to refresh group metadata", { jid, err: error });
  }
}

export function setRedirectReplyMapping(groupMessageId: string, senderJid: string) {
  redirectReplyMapCache.set(groupMessageId, senderJid);

  log.debug("WhatsApp: redirect reply mapping set", { groupMessageId, senderJid });
}

export function getRedirectReplyMapping(groupMessageId: string) {
  return redirectReplyMapCache.get(groupMessageId);
}

export function setCallState(callId: string, state: CallState) {
  callStateCache.set(callId, state);
}

export function getCallState(callId: string) {
  return callStateCache.get(callId);
}

export function deleteCallState(callId: string) {
  callStateCache.del(callId);
}
