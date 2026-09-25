import type { Context } from "hono";
import type { WASocket } from "@whiskeysockets/baileys";

import { getActiveSocket } from "@core/whatsapp-socket.core";

export function ok<C extends Context, T = null>(c: C, data: T = null as T, message = "OK") {
  return c.json({ success: true, message, data, error: null }, 200);
}

export function fail<C extends Context, S extends 400 | 404 | 409 | 422 | 500 | 503 = 400>(
  c: C,
  message: string,
  status: S = 400 as S,
  code = "BAD_REQUEST",
) {
  return c.json({ success: false, message, data: null, error: { code, message } }, status);
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

export function withSocket<C extends Context, R>(handler: (c: C, sock: WASocket) => Promise<R>) {
  return async (c: C) => {
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
