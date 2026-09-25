import { ok, requireFields, withSocket } from "@core/helpers/index.helper";
import { rejectCall as rejectCallService } from "@services/whatsapp/call/call.service";

export const reject = withSocket(async (c, sock) => {
  const body = await c.req.json();
  const error = requireFields(c, body, ["id", "from"]);

  if (error) return error;

  await rejectCallService(sock, { id: body.id, from: body.from });

  return ok(c, null, "Call rejected");
});
