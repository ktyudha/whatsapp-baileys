import type { RouteHandler } from "@hono/zod-openapi";

import { ok, withSocket } from "@core/helpers/index.helper";
import type { RejectCallRoute } from "@routes/v1/call/call.routes";
import { rejectCall as rejectCallService } from "@services/whatsapp/call/call.service";

export const reject: RouteHandler<RejectCallRoute> = withSocket(async (c, sock) => {
  const { id, from } = c.req.valid("json");

  await rejectCallService(sock, { id, from });

  return ok(c, null, "Call rejected");
});
