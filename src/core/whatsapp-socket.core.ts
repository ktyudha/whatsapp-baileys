import type { WASocket } from "@whiskeysockets/baileys";

let activeSocket: WASocket | undefined;

export function setActiveSocket(sock: WASocket | undefined) {
  activeSocket = sock;
}

export function getActiveSocket(): WASocket {
  if (!activeSocket) {
    throw new Error("WhatsApp socket is not connected yet");
  }

  return activeSocket;
}

export function isSocketConnected(): boolean {
  return Boolean(activeSocket);
}
