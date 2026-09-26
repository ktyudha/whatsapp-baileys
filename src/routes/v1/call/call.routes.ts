import { createRoute } from "@hono/zod-openapi";

import jsonContentRequired from "@core/helpers/json-content-required.helper";
import { rejectCallSchema } from "@core/schemas/call.schema";
import { nullSuccessResponse } from "@core/schemas/common.schema";
import { BaseRoutes } from "@routes/base.route";

export class CallRoutes extends BaseRoutes {
  reject = createRoute({
    tags: ["Call"],
    description: "Reject an incoming call",
    path: "/calls/reject",
    method: "post",
    request: { body: jsonContentRequired(rejectCallSchema, "Reject call payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Call rejected"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });
}

export type RejectCallRoute = typeof CallRoutes.prototype.reject;
