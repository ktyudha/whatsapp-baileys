import type { Context } from "hono";

import { ok } from "@core/helpers/index.helper";
import { isSocketConnected } from "@core/whatsapp-socket.core";

export const getStatus = (c: Context) => {
  return ok(c, { connected: isSocketConnected() });
};
