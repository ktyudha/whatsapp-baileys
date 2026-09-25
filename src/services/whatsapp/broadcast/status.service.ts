import type { AnyRegularMessageContent, WASocket } from "@whiskeysockets/baileys";

import { log } from "@core/helpers/index.helper";

const STATUS_JID = "status@broadcast";

export type PostStatusOptions = {
  statusJidList: string[];
  backgroundColor?: string;
  font?: number;
};

export async function postStatus(
  sock: WASocket,
  content: AnyRegularMessageContent,
  { statusJidList, backgroundColor, font }: PostStatusOptions,
) {
  try {
    const message = await sock.sendMessage(STATUS_JID, content, {
      broadcast: true,
      statusJidList,
      backgroundColor,
      font,
    });

    log.info("WhatsApp: status posted", {
      id: message?.key.id,
      recipients: statusJidList.length,
    });

    return message;
  } catch (error) {
    log.error("WhatsApp: failed to post status", { err: error });
  }
}

export async function postTextStatus(
  sock: WASocket,
  text: string,
  options: PostStatusOptions,
) {
  return postStatus(sock, { text }, options);
}
