import type { RouteHandler } from "@hono/zod-openapi";

import { ok } from "@core/helpers/index.helper";
import { isSocketConnected } from "@core/whatsapp-socket.core";
import type { GetStatusRoute } from "@routes/whatsapp/status.routes";

export const getStatus: RouteHandler<GetStatusRoute> = (c) => {
  return ok(c, { connected: isSocketConnected() });
};
