import type {
  WAPrivacyCallValue,
  WAPrivacyGroupAddValue,
  WAPrivacyMessagesValue,
  WAPrivacyOnlineValue,
  WAPrivacyValue,
  WAReadReceiptsValue,
  WASocket,
} from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";

export async function blockContact(sock: WASocket, jid: string) {
  try {
    await sock.updateBlockStatus(jid, "block");

    log.info("WhatsApp: contact blocked", { jid });
  } catch (error) {
    log.error("WhatsApp: failed to block contact", { jid, err: error });
  }
}

export async function unblockContact(sock: WASocket, jid: string) {
  try {
    await sock.updateBlockStatus(jid, "unblock");

    log.info("WhatsApp: contact unblocked", { jid });
  } catch (error) {
    log.error("WhatsApp: failed to unblock contact", { jid, err: error });
  }
}

export async function getPrivacySettings(sock: WASocket, force = false) {
  try {
    return await sock.fetchPrivacySettings(force);
  } catch (error) {
    log.error("WhatsApp: failed to fetch privacy settings", { err: error });
  }
}

export async function getBlockedContacts(sock: WASocket) {
  try {
    return await sock.fetchBlocklist();
  } catch (error) {
    log.error("WhatsApp: failed to fetch blocklist", { err: error });
  }
}

export async function updateLastSeenPrivacy(sock: WASocket, value: WAPrivacyValue) {
  try {
    await sock.updateLastSeenPrivacy(value);

    log.info("WhatsApp: last seen privacy updated", { value });
  } catch (error) {
    log.error("WhatsApp: failed to update last seen privacy", { value, err: error });
  }
}

export async function updateOnlinePrivacy(sock: WASocket, value: WAPrivacyOnlineValue) {
  try {
    await sock.updateOnlinePrivacy(value);

    log.info("WhatsApp: online privacy updated", { value });
  } catch (error) {
    log.error("WhatsApp: failed to update online privacy", { value, err: error });
  }
}

export async function updateProfilePicturePrivacy(sock: WASocket, value: WAPrivacyValue) {
  try {
    await sock.updateProfilePicturePrivacy(value);

    log.info("WhatsApp: profile picture privacy updated", { value });
  } catch (error) {
    log.error("WhatsApp: failed to update profile picture privacy", { value, err: error });
  }
}

export async function updateStatusPrivacy(sock: WASocket, value: WAPrivacyValue) {
  try {
    await sock.updateStatusPrivacy(value);

    log.info("WhatsApp: status privacy updated", { value });
  } catch (error) {
    log.error("WhatsApp: failed to update status privacy", { value, err: error });
  }
}

export async function updateReadReceiptsPrivacy(sock: WASocket, value: WAReadReceiptsValue) {
  try {
    await sock.updateReadReceiptsPrivacy(value);

    log.info("WhatsApp: read receipts privacy updated", { value });
  } catch (error) {
    log.error("WhatsApp: failed to update read receipts privacy", { value, err: error });
  }
}

export async function updateGroupsAddPrivacy(sock: WASocket, value: WAPrivacyGroupAddValue) {
  try {
    await sock.updateGroupsAddPrivacy(value);

    log.info("WhatsApp: groups add privacy updated", { value });
  } catch (error) {
    log.error("WhatsApp: failed to update groups add privacy", { value, err: error });
  }
}

export async function updateCallPrivacy(sock: WASocket, value: WAPrivacyCallValue) {
  try {
    await sock.updateCallPrivacy(value);

    log.info("WhatsApp: call privacy updated", { value });
  } catch (error) {
    log.error("WhatsApp: failed to update call privacy", { value, err: error });
  }
}

export async function updateMessagesPrivacy(sock: WASocket, value: WAPrivacyMessagesValue) {
  try {
    await sock.updateMessagesPrivacy(value);

    log.info("WhatsApp: messages privacy updated", { value });
  } catch (error) {
    log.error("WhatsApp: failed to update messages privacy", { value, err: error });
  }
}

export async function updateDefaultDisappearingMode(sock: WASocket, durationSeconds: number) {
  try {
    await sock.updateDefaultDisappearingMode(durationSeconds);

    log.info("WhatsApp: default disappearing mode updated", { durationSeconds });
  } catch (error) {
    log.error("WhatsApp: failed to update default disappearing mode", {
      durationSeconds,
      err: error,
    });
  }
}
