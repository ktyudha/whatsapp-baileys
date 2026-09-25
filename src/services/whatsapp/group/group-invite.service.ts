import type { proto, WAMessageKey, WASocket } from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";

const INVITE_LINK_PREFIX = "https://chat.whatsapp.com/";

export async function getGroupInviteLink(sock: WASocket, jid: string) {
  try {
    const code = await sock.groupInviteCode(jid);

    return code ? `${INVITE_LINK_PREFIX}${code}` : undefined;
  } catch (error) {
    log.error("WhatsApp: failed to get group invite link", { jid, err: error });
  }
}

export async function revokeGroupInviteLink(sock: WASocket, jid: string) {
  try {
    const code = await sock.groupRevokeInvite(jid);

    log.info("WhatsApp: group invite link revoked", { jid });

    return code ? `${INVITE_LINK_PREFIX}${code}` : undefined;
  } catch (error) {
    log.error("WhatsApp: failed to revoke group invite link", { jid, err: error });
  }
}

export async function joinGroupByInviteCode(sock: WASocket, code: string) {
  try {
    const jid = await sock.groupAcceptInvite(code);

    log.info("WhatsApp: joined group via invite code", { jid });

    return jid;
  } catch (error) {
    log.error("WhatsApp: failed to join group via invite code", { err: error });
  }
}

export async function getGroupInviteInfo(sock: WASocket, code: string) {
  try {
    return await sock.groupGetInviteInfo(code);
  } catch (error) {
    log.error("WhatsApp: failed to get group invite info", { err: error });
  }
}

export async function joinGroupByInviteMessage(
  sock: WASocket,
  key: string | WAMessageKey,
  inviteMessage: proto.Message.IGroupInviteMessage,
) {
  try {
    const result = await sock.groupAcceptInviteV4(key, inviteMessage);

    log.info("WhatsApp: joined group via invite message", { jid: inviteMessage.groupJid });

    return result;
  } catch (error) {
    log.error("WhatsApp: failed to join group via invite message", {
      jid: inviteMessage.groupJid,
      err: error,
    });
  }
}

export async function listGroupJoinRequests(sock: WASocket, jid: string) {
  try {
    return await sock.groupRequestParticipantsList(jid);
  } catch (error) {
    log.error("WhatsApp: failed to list group join requests", { jid, err: error });
  }
}

export async function updateGroupJoinRequests(
  sock: WASocket,
  jid: string,
  participants: string[],
  action: "approve" | "reject",
) {
  try {
    const result = await sock.groupRequestParticipantsUpdate(jid, participants, action);

    log.info("WhatsApp: group join requests updated", { jid, action, participants });

    return result;
  } catch (error) {
    log.error("WhatsApp: failed to update group join requests", {
      jid,
      action,
      participants,
      err: error,
    });
  }
}
