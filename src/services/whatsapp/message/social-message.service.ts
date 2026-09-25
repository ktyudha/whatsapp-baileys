import { proto } from "@whiskeysockets/baileys";
import type {
  GroupInviteInfo,
  WALocationMessage,
  WAMessageKey,
  WASocket,
} from "@whiskeysockets/baileys";

import { sendMessage } from "./send-message.service";

export async function reactToMessage(
  sock: WASocket,
  jid: string,
  key: WAMessageKey,
  emoji: string,
) {
  return sendMessage(sock, jid, { react: { key, text: emoji } });
}

export async function removeReaction(sock: WASocket, jid: string, key: WAMessageKey) {
  return reactToMessage(sock, jid, key, "");
}

export async function sendLocationMessage(
  sock: WASocket,
  jid: string,
  location: WALocationMessage,
) {
  return sendMessage(sock, jid, { location });
}

export async function sendContactMessage(
  sock: WASocket,
  jid: string,
  contacts: proto.Message.IContactMessage[],
  displayName?: string,
) {
  return sendMessage(sock, jid, { contacts: { displayName, contacts } });
}

export async function sendGroupInviteMessage(
  sock: WASocket,
  jid: string,
  groupInvite: GroupInviteInfo,
) {
  return sendMessage(sock, jid, { groupInvite });
}

export async function pinMessage(
  sock: WASocket,
  jid: string,
  key: WAMessageKey,
  durationSeconds?: 86400 | 604800 | 2592000,
) {
  return sendMessage(sock, jid, {
    pin: key,
    type: proto.PinInChat.Type.PIN_FOR_ALL,
    time: durationSeconds,
  });
}

export async function unpinMessage(sock: WASocket, jid: string, key: WAMessageKey) {
  return sendMessage(sock, jid, {
    pin: key,
    type: proto.PinInChat.Type.UNPIN_FOR_ALL,
  });
}
