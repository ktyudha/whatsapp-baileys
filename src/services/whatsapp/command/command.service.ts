import type { ParticipantAction, WAMessage, WASocket } from "@whiskeysockets/baileys";

import env from "@/config/env.config";
import {
  getMessageLocation,
  getMessageSenderJid,
  getMessageText,
  isJidGroup,
  isJidWhitelisted,
  log,
  toWhatsAppJid,
} from "@core/helpers/index.helper";
import { imageToWebpSticker, videoToWebpSticker } from "@core/helpers/sticker.helper";
import { downloadIncomingMedia } from "@services/whatsapp/message/media-download.service";
import { sendStickerMessage } from "@services/whatsapp/message/media-message.service";
import { replyTextMessage, sendTextMessage } from "@services/whatsapp/message/send-message.service";
import {
  getAllParticipatingGroups,
  getGroupMetadata,
  updateGroupParticipants,
} from "@services/whatsapp/group/manage-group.service";

export type CommandHandler = (
  sock: WASocket,
  message: WAMessage,
  args: string[],
  senderJid: string,
) => Promise<void>;

const commands = new Map<string, CommandHandler>();

export function isCommandMessage(text: string | undefined): boolean {
  return Boolean(text?.startsWith(env.WA_COMMAND_PREFIX));
}

export function isCommandSenderAllowed(senderJid: string | undefined): boolean {
  return isJidWhitelisted(senderJid, env.WA_COMMAND_ADMIN_JIDS);
}

export async function handleCommand(sock: WASocket, message: WAMessage) {
  const senderJid = getMessageSenderJid(message);

  if (!isCommandSenderAllowed(senderJid)) {
    log.warn("WhatsApp: command rejected, sender not whitelisted", { senderJid });
    return;
  }

  const text = getMessageText(message) ?? "";
  const [rawCommand, ...args] = text.slice(env.WA_COMMAND_PREFIX.length).trim().split(/\s+/);
  const commandName = rawCommand?.toLowerCase();
  const handler = commandName ? commands.get(commandName) : undefined;

  if (!handler) {
    log.warn("WhatsApp: unknown command", { senderJid, commandName });
    await replyTextMessage(sock, message.key.remoteJid!, "Perintah tidak dikenal. Ketik *!help*.", message);
    return;
  }

  try {
    await handler(sock, message, args, senderJid as string);
    log.info("WhatsApp: command executed", { senderJid, commandName });
  } catch (error) {
    log.error("WhatsApp: command failed", { senderJid, commandName, err: error });
    await replyTextMessage(sock, message.key.remoteJid!, "Terjadi kesalahan saat menjalankan perintah.", message);
  }
}

function resolveGroupTarget(message: WAMessage, target: string | undefined): string | undefined {
  if (target?.toLowerCase() === "here" && isJidGroup(message.key.remoteJid ?? undefined)) {
    return message.key.remoteJid!;
  }

  return target?.endsWith("@g.us") ? target : undefined;
}

async function updateParticipants(
  sock: WASocket,
  message: WAMessage,
  args: string[],
  action: ParticipantAction,
  label: string,
) {
  const [target, numbersRaw] = args;
  const groupJid = resolveGroupTarget(message, target);

  if (!groupJid || !numbersRaw) {
    await replyTextMessage(
      sock,
      message.key.remoteJid!,
      `*Usage:*\n!${label} <groupId|here> <nomor1,nomor2>`,
      message,
    );
    return;
  }

  const participants = numbersRaw
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean)
    .map(toWhatsAppJid);

  const result = await updateGroupParticipants(sock, groupJid, participants, action);

  const summary = (result ?? [])
    .map((r) => `${r.jid}: ${r.status === "200" ? "OK" : `gagal (${r.status})`}`)
    .join("\n");

  await replyTextMessage(
    sock,
    message.key.remoteJid!,
    `*${label} selesai*\n\n${summary || "Tidak ada perubahan."}`,
    message,
  );
}

commands.set("ping", async (sock, message) => {
  await replyTextMessage(sock, message.key.remoteJid!, "pong", message);
});

commands.set("help", async (sock, message) => {
  const list = Array.from(commands.keys())
    .map((name) => `• !${name}`)
    .join("\n");

  await replyTextMessage(sock, message.key.remoteJid!, `*WhatsApp Bot Commands*\n\n${list}`, message);
});

commands.set("whoami", async (sock, message, _args, senderJid) => {
  await replyTextMessage(
    sock,
    message.key.remoteJid!,
    `*Debug Info*\n\nchat: ${message.key.remoteJid}\nsender: ${senderJid}\npushName: ${message.pushName ?? "-"}`,
    message,
  );
});

commands.set("status", async (sock, message) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const mem = process.memoryUsage();
  const mbUsed = (mem.heapUsed / 1024 / 1024).toFixed(1);
  const mbTotal = (mem.heapTotal / 1024 / 1024).toFixed(1);

  await replyTextMessage(
    sock,
    message.key.remoteJid!,
    `*Status Bot*\n\n` +
      `Uptime : ${hours}j ${minutes}m ${seconds}d\n` +
      `Memory : ${mbUsed} / ${mbTotal} MB\n` +
      `Node.js: ${process.version}`,
    message,
  );
});

commands.set("list-group", async (sock, message) => {
  const groups = await getAllParticipatingGroups(sock);

  if (!groups || Object.keys(groups).length === 0) {
    await replyTextMessage(sock, message.key.remoteJid!, "Tidak ada group ditemukan.", message);
    return;
  }

  const lines = Object.values(groups).map(
    (g, i) => `*${i + 1}. ${g.subject}*\nid     : ${g.id}\nmembers: ${g.participants.length}`,
  );

  await replyTextMessage(sock, message.key.remoteJid!, `*Daftar Group*\n\n${lines.join("\n\n")}`, message);
});

commands.set("info", async (sock, message, args) => {
  const target = args[0]?.trim();
  const groupJid = target?.endsWith("@g.us")
    ? target
    : isJidGroup(message.key.remoteJid ?? undefined) && !target
      ? message.key.remoteJid!
      : undefined;

  if (groupJid) {
    const metadata = await getGroupMetadata(sock, groupJid);

    if (!metadata) {
      await replyTextMessage(sock, message.key.remoteJid!, `Gagal ambil info group: ${groupJid}`, message);
      return;
    }

    await replyTextMessage(
      sock,
      message.key.remoteJid!,
      `*Info Group*\n\n` +
        `Nama     : ${metadata.subject}\n` +
        `ID       : ${metadata.id}\n` +
        `Members  : ${metadata.participants.length}\n` +
        `Deskripsi: ${metadata.desc || "-"}`,
      message,
    );
    return;
  }

  const jid = target ? toWhatsAppJid(target) : message.key.remoteJidAlt || message.key.remoteJid!;
  const [result] = (await sock.onWhatsApp(jid)) ?? [];

  await replyTextMessage(
    sock,
    message.key.remoteJid!,
    `*Info Kontak*\n\n` +
      `Nomor  : +${(result?.jid || jid).split("@")[0]}\n` +
      `ID     : ${result?.jid || jid}\n` +
      `Di WA  : ${result?.exists ? "Ya" : "Tidak"}`,
    message,
  );
});

commands.set("send", async (sock, message, args) => {
  if (args.length < 2) {
    await replyTextMessage(
      sock,
      message.key.remoteJid!,
      "*Usage:*\n!send <nomor|groupId> <pesan>\n\n*Contoh:*\n!send 6281234567890 Halo!",
      message,
    );
    return;
  }

  const [target, ...rest] = args;
  const jid = toWhatsAppJid(target);
  const text = rest.join(" ");

  await sendTextMessage(sock, jid, text);
  await replyTextMessage(sock, message.key.remoteJid!, `Pesan terkirim ke *${target}*`, message);
});

// Usage:
//   !broadcast all-groups | Pesan
//   !broadcast 628xxx,628yyy,groupId@g.us | Pesan
commands.set("broadcast", async (sock, message, args) => {
  const fullText = args.join(" ");
  const separatorIndex = fullText.indexOf("|");

  if (separatorIndex === -1) {
    await replyTextMessage(
      sock,
      message.key.remoteJid!,
      "*Usage:*\n!broadcast all-groups | Pesan\n!broadcast 628xxx,628yyy,groupId@g.us | Pesan",
      message,
    );
    return;
  }

  const targetsRaw = fullText.slice(0, separatorIndex).trim();
  const text = fullText.slice(separatorIndex + 1).trim();

  if (!targetsRaw || !text) {
    await replyTextMessage(sock, message.key.remoteJid!, "Target dan pesan tidak boleh kosong.", message);
    return;
  }

  let targets = targetsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (targets.includes("all-groups")) {
    const groups = await getAllParticipatingGroups(sock);
    targets = Object.keys(groups ?? {});
  } else {
    targets = targets.map(toWhatsAppJid);
  }

  const results = await Promise.allSettled(targets.map((jid) => sendTextMessage(sock, jid, text)));
  const success = results.filter((r) => r.status === "fulfilled" && r.value).length;
  const failed = targets.length - success;

  await replyTextMessage(
    sock,
    message.key.remoteJid!,
    `*Broadcast Selesai*\n\nBerhasil: ${success}\nGagal   : ${failed}`,
    message,
  );
});

commands.set("sticker", async (sock, message) => {
  const source = message.message?.extendedTextMessage?.contextInfo?.quotedMessage
    ? ({
        key: {
          remoteJid: message.key.remoteJid,
          id: message.message.extendedTextMessage!.contextInfo!.stanzaId,
          fromMe: false,
        },
        message: message.message.extendedTextMessage!.contextInfo!.quotedMessage,
      } as WAMessage)
    : message;

  const media = await downloadIncomingMedia(sock, source);

  if (!media || (media.type !== "image" && media.type !== "video")) {
    await replyTextMessage(
      sock,
      message.key.remoteJid!,
      "Kirim gambar/video (atau reply gambar/video) lalu ketik `!sticker`.",
      message,
    );
    return;
  }

  try {
    const webp =
      media.type === "image"
        ? await imageToWebpSticker(media.buffer)
        : await videoToWebpSticker(media.buffer);

    await sendStickerMessage(sock, message.key.remoteJid!, webp);
  } catch (error) {
    log.error("WhatsApp: failed to convert media to sticker", { err: error });
    await replyTextMessage(sock, message.key.remoteJid!, "Gagal membuat sticker. Coba lagi.", message);
  }
});

commands.set("location", async (sock, message) => {
  const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const location = getMessageLocation(message) ?? (quoted ? getMessageLocation({ message: quoted } as WAMessage) : undefined);

  if (!location) {
    await replyTextMessage(
      sock,
      message.key.remoteJid!,
      "Kirim lokasi atau reply pesan lokasi lalu ketik `!location`.",
      message,
    );
    return;
  }

  await replyTextMessage(
    sock,
    message.key.remoteJid!,
    `*Location*\n\nLat: ${location.latitude}\nLng: ${location.longitude}\n` +
      (location.address ? `Address: ${location.address}` : ""),
    message,
  );
});

commands.set("add", (sock, message, args) => updateParticipants(sock, message, args, "add", "add"));
commands.set("kick", (sock, message, args) => updateParticipants(sock, message, args, "remove", "kick"));
commands.set("promote", (sock, message, args) => updateParticipants(sock, message, args, "promote", "promote"));
commands.set("demote", (sock, message, args) => updateParticipants(sock, message, args, "demote", "demote"));
