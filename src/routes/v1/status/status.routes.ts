import { createRoute } from "@hono/zod-openapi";

import { socketStatusSuccessResponse } from "@core/schemas/status.schema";
import { BaseRoutes } from "@routes/base.route";

export class StatusRoutes extends BaseRoutes {
  getStatus = createRoute({
    tags: ["Status"],
    description: "Get the WhatsApp socket connection status",
    path: "/status",
    method: "get",
    responses: {
      200: this.successResponse(socketStatusSuccessResponse, "Status retrieved"),
    },
  });
}

export type GetStatusRoute = typeof StatusRoutes.prototype.getStatus;
