import type { Context } from "hono";
import type { WASocket } from "@whiskeysockets/baileys";

import { getActiveSocket } from "@core/whatsapp-socket.core";

export function ok(c: Context, data: unknown = null, message = "OK") {
  return c.json({ success: true, message, data, error: null }, 200);
}

export function fail(c: Context, message: string, status = 400, code = "BAD_REQUEST") {
  return c.json(
    { success: false, message, data: null, error: { code, message } },
    status as 400 | 404 | 409 | 500 | 503,
  );
}

export function requireFields(
  c: Context,
  body: Record<string, unknown>,
  fields: string[],
): Response | undefined {
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || body[field] === "") {
      return fail(c, `Field "${field}" is required`, 400, "VALIDATION_ERROR");
    }
  }

  return undefined;
}

type SocketHandler = (c: Context, sock: WASocket) => Promise<Response>;

export function withSocket(handler: SocketHandler) {
  return async (c: Context) => {
    try {
      const sock = getActiveSocket();

      return await handler(c, sock);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      if (message.includes("not connected")) {
        return fail(c, message, 503, "SOCKET_NOT_READY");
      }

      return fail(c, message, 500, "INTERNAL_ERROR");
    }
  };
}
