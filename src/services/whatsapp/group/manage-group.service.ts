import type { ParticipantAction, WASocket } from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";

export async function createGroup(sock: WASocket, subject: string, participants: string[]) {
  try {
    const group = await sock.groupCreate(subject, participants);

    log.info("WhatsApp: group created", { jid: group.id, subject });

    return group;
  } catch (error) {
    log.error("WhatsApp: failed to create group", { subject, err: error });
  }
}

export async function updateGroupParticipants(
  sock: WASocket,
  jid: string,
  participants: string[],
  action: ParticipantAction,
) {
  try {
    const result = await sock.groupParticipantsUpdate(jid, participants, action);

    log.info("WhatsApp: group participants updated", { jid, action, participants });

    return result;
  } catch (error) {
    log.error("WhatsApp: failed to update group participants", {
      jid,
      action,
      participants,
      err: error,
    });
  }
}

export async function updateGroupSubject(sock: WASocket, jid: string, subject: string) {
  try {
    await sock.groupUpdateSubject(jid, subject);

    log.info("WhatsApp: group subject updated", { jid, subject });
  } catch (error) {
    log.error("WhatsApp: failed to update group subject", { jid, subject, err: error });
  }
}

export async function updateGroupDescription(sock: WASocket, jid: string, description: string) {
  try {
    await sock.groupUpdateDescription(jid, description);

    log.info("WhatsApp: group description updated", { jid });
  } catch (error) {
    log.error("WhatsApp: failed to update group description", { jid, err: error });
  }
}

export async function updateGroupSetting(
  sock: WASocket,
  jid: string,
  setting: "announcement" | "not_announcement" | "locked" | "unlocked",
) {
  try {
    await sock.groupSettingUpdate(jid, setting);

    log.info("WhatsApp: group setting updated", { jid, setting });
  } catch (error) {
    log.error("WhatsApp: failed to update group setting", { jid, setting, err: error });
  }
}

export async function updateGroupMemberAddMode(
  sock: WASocket,
  jid: string,
  mode: "admin_add" | "all_member_add",
) {
  try {
    await sock.groupMemberAddMode(jid, mode);

    log.info("WhatsApp: group member add mode updated", { jid, mode });
  } catch (error) {
    log.error("WhatsApp: failed to update group member add mode", { jid, mode, err: error });
  }
}

export async function toggleGroupEphemeral(sock: WASocket, jid: string, expirationSeconds: number) {
  try {
    await sock.groupToggleEphemeral(jid, expirationSeconds);

    log.info("WhatsApp: group ephemeral messages updated", { jid, expirationSeconds });
  } catch (error) {
    log.error("WhatsApp: failed to update group ephemeral messages", {
      jid,
      expirationSeconds,
      err: error,
    });
  }
}

export async function leaveGroup(sock: WASocket, jid: string) {
  try {
    await sock.groupLeave(jid);

    log.info("WhatsApp: left group", { jid });
  } catch (error) {
    log.error("WhatsApp: failed to leave group", { jid, err: error });
  }
}

export async function getGroupMetadata(sock: WASocket, jid: string) {
  try {
    return await sock.groupMetadata(jid);
  } catch (error) {
    log.error("WhatsApp: failed to fetch group metadata", { jid, err: error });
  }
}

export async function getAllParticipatingGroups(sock: WASocket) {
  try {
    return await sock.groupFetchAllParticipating();
  } catch (error) {
    log.error("WhatsApp: failed to fetch participating groups", { err: error });
  }
}
