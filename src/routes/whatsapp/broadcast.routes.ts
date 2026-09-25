import { createRoute } from "@hono/zod-openapi";

import jsonContentRequired from "@core/helpers/json-content-required.helper";
import {
  broadcastJidParamsSchema,
  postStatusSchema,
  sendToListSchema,
} from "@core/schemas/broadcast.schema";
import { anySuccessResponse, nullSuccessResponse } from "@core/schemas/common.schema";
import { BaseRoutes } from "@routes/base.route";

export class BroadcastRoutes extends BaseRoutes {
  postStatus = createRoute({
    tags: ["Broadcast"],
    description: "Post a text status update",
    path: "/broadcast/status",
    method: "post",
    request: { body: jsonContentRequired(postStatusSchema, "Status payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Status posted"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to post status"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  sendToList = createRoute({
    tags: ["Broadcast"],
    description: "Send a message to a broadcast list",
    path: "/broadcast/list/send",
    method: "post",
    request: { body: jsonContentRequired(sendToListSchema, "Broadcast list payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Sent to broadcast list"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to send"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  deleteList = createRoute({
    tags: ["Broadcast"],
    description: "Delete a broadcast list",
    path: "/broadcast/list/{jid}",
    method: "delete",
    request: { params: broadcastJidParamsSchema },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Broadcast list deleted"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });
}

export type PostStatusRoute = typeof BroadcastRoutes.prototype.postStatus;
export type SendToListRoute = typeof BroadcastRoutes.prototype.sendToList;
export type DeleteListRoute = typeof BroadcastRoutes.prototype.deleteList;
