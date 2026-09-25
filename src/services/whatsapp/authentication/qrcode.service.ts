import qrcode from "qrcode-terminal";

import { log } from "@core/helpers/index.helper";

export function handleQrCode(qr: string) {
  log.info("WhatsApp: scan the QR code below to login");

  qrcode.generate(qr, { small: true });
}
