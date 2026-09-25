import type { WAMessage } from "@whiskeysockets/baileys";
import {
  areJidsSameUser,
  isJidBroadcast,
  isJidGroup,
  isJidNewsletter,
  isJidStatusBroadcast,
  isLidUser,
  isPnUser,
  jidDecode,
  jidNormalizedUser,
} from "@whiskeysockets/baileys";

export type JidType =
  | "user"
  | "group"
  | "broadcast"
  | "status"
  | "newsletter"
  | "unknown";

export function getJidType(jid: string | undefined): JidType {
  if (!jid) return "unknown";
  if (isJidStatusBroadcast(jid)) return "status";
  if (isJidNewsletter(jid)) return "newsletter";
  if (isJidBroadcast(jid)) return "broadcast";
  if (isJidGroup(jid)) return "group";
  if (isPnUser(jid) || isLidUser(jid)) return "user";
  return "unknown";
}

export function isPrivateChat(jid: string | undefined): boolean {
  return getJidType(jid) === "user";
}

export function isGroupChat(jid: string | undefined): boolean {
  return getJidType(jid) === "group";
}

export function toWhatsAppJid(numberOrJid: string): string {
  if (numberOrJid.endsWith("@c.us")) {
    return `${numberOrJid.slice(0, -"@c.us".length)}@s.whatsapp.net`;
  }

  if (numberOrJid.includes("@")) return numberOrJid;

  return `${numberOrJid.replace(/\D/g, "")}@s.whatsapp.net`;
}

/** Real (non-LID) JID of whoever actually sent the message, e.g. for command auth checks. */
export function getMessageSenderJid(message: WAMessage): string | undefined {
  if (message.key.fromMe) return undefined;

  const jid = isGroupChat(message.key.remoteJid ?? undefined)
    ? message.key.participantAlt || message.key.participant
    : message.key.remoteJidAlt || message.key.remoteJid;

  return jid ? jidNormalizedUser(jid) : undefined;
}

export function isJidWhitelisted(jid: string | undefined, whitelist: string[]): boolean {
  if (!jid || whitelist.length === 0) return false;

  return whitelist.some((allowed) => areJidsSameUser(jid, toWhatsAppJid(allowed)));
}

export { areJidsSameUser, isJidGroup, isJidNewsletter, isJidBroadcast, jidDecode, jidNormalizedUser };
