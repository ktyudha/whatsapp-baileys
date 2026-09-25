import type { WACallEvent, WASocket } from "@whiskeysockets/baileys";

import { formatDateAsJFY, formatTime, log } from "@core/helpers/index.helper";
import {
  deleteCallState,
  getCallState,
  setCallState,
  type CallState,
} from "@core/whatsapp-cache.core";
import env from "@/config/env.config";
import { sendTextMessage } from "@services/whatsapp/message/send-message.service";

export async function rejectCall(sock: WASocket, call: Pick<WACallEvent, "id" | "from">) {
  try {
    await sock.rejectCall(call.id, call.from);

    log.info("WhatsApp: call rejected", { from: call.from, id: call.id });
  } catch (error) {
    log.error("WhatsApp: failed to reject call", { from: call.from, id: call.id, err: error });
  }
}

function formatCallDuration(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return minutes > 0 ? `${minutes} menit ${seconds} detik` : `${seconds} detik`;
}

async function notifyRedirectGroup(
  sock: WASocket,
  call: WACallEvent,
  state: CallState,
  status: string,
  duration?: string,
) {
  const redirectGroupId = env.WA_REDIRECT_GROUP_ID;

  if (!redirectGroupId) return;

  const number = (call.callerPn || state.from).split("@")[0];
  const callType = state.isVideo ? "Video Call" : "Voice Call";

  const text =
    `*Panggilan Masuk*\n\n` +
    `*Nomor*: +${number}\n` +
    `*Jenis*: ${callType}\n` +
    `*Waktu*: ${formatTime(state.offerAt)} - ${formatDateAsJFY(state.offerAt)}\n` +
    `*Status*: ${status}` +
    (duration ? `\n*Durasi*: ${duration}` : "");

  await sendTextMessage(sock, redirectGroupId, text);
}

export async function handleIncomingCalls(sock: WASocket, calls: WACallEvent[]) {
  for (const call of calls) {
    log.info("WhatsApp: incoming call", { from: call.from, status: call.status });

    if (call.status === "offer") {
      const state: CallState = {
        from: call.from,
        isVideo: Boolean(call.isVideo),
        offerAt: call.date ?? new Date(),
      };

      if (env.WA_REJECT_CALLS) {
        await rejectCall(sock, call);

        const callType = call.isVideo ? "panggilan video" : "panggilan suara";

        await sendTextMessage(
          sock,
          call.callerPn || call.from,
          `Mohon maaf, ${callType} tidak dapat kami layani di nomor ini.\n\n` +
          `Silakan kirimkan pesan teks agar keperluan Anda dapat segera kami tanggapi.`,
        );

        // WhatsApp doesn't reliably echo a "reject" status back for calls we reject
        // ourselves, so finalize immediately instead of waiting for one.
        await notifyRedirectGroup(sock, call, state, "Ditolak");
        continue;
      }

      setCallState(call.id, state);
      continue;
    }

    const state = getCallState(call.id);

    if (!state) continue;

    if (call.status === "accept") {
      if (!state.acceptedAt) setCallState(call.id, { ...state, acceptedAt: new Date() });
      continue;
    }

    if (call.status === "reject") {
      deleteCallState(call.id);
      await notifyRedirectGroup(sock, call, state, "Ditolak");
      continue;
    }

    if (call.status === "timeout") {
      deleteCallState(call.id);
      await notifyRedirectGroup(sock, call, state, "Tidak diangkat");
      continue;
    }

    if (call.status === "terminate") {
      deleteCallState(call.id);

      if (state.acceptedAt) {
        const duration = formatCallDuration(Date.now() - state.acceptedAt.getTime());
        await notifyRedirectGroup(sock, call, state, "Diangkat", duration);
      } else {
        await notifyRedirectGroup(sock, call, state, "Dibatalkan");
      }
    }
  }
}
