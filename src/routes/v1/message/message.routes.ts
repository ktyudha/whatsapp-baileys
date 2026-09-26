import { createRoute } from "@hono/zod-openapi";

import jsonContentRequired from "@core/helpers/json-content-required.helper";
import {
  deleteMessageSchema,
  editMessageSchema,
  sendPollMessageSchema,
  sendTextMessageSchema,
  sentMessageSuccessResponse,
} from "@core/schemas/message.schema";
import { BaseRoutes } from "@routes/base.route";

export class MessageRoutes extends BaseRoutes {
  sendText = createRoute({
    tags: ["Message"],
    description: "Send a text message",
    path: "/messages/text",
    method: "post",
    request: {
      body: jsonContentRequired(sendTextMessageSchema, "Text message payload"),
    },
    responses: {
      200: this.successResponse(sentMessageSuccessResponse, "Message sent"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to send message"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  delete = createRoute({
    tags: ["Message"],
    description: "Delete (revoke) a message",
    path: "/messages/delete",
    method: "post",
    request: {
      body: jsonContentRequired(deleteMessageSchema, "Delete message payload"),
    },
    responses: {
      200: this.successResponse(sentMessageSuccessResponse, "Message deleted"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to delete message"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  edit = createRoute({
    tags: ["Message"],
    description: "Edit a previously sent text message",
    path: "/messages/edit",
    method: "post",
    request: {
      body: jsonContentRequired(editMessageSchema, "Edit message payload"),
    },
    responses: {
      200: this.successResponse(sentMessageSuccessResponse, "Message edited"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to edit message"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  sendPoll = createRoute({
    tags: ["Message"],
    description: "Send a poll message",
    path: "/messages/poll",
    method: "post",
    request: {
      body: jsonContentRequired(sendPollMessageSchema, "Poll message payload"),
    },
    responses: {
      200: this.successResponse(sentMessageSuccessResponse, "Poll sent"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to send poll"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });
}

export type SendTextMessageRoute = typeof MessageRoutes.prototype.sendText;
export type DeleteMessageRoute = typeof MessageRoutes.prototype.delete;
export type EditMessageRoute = typeof MessageRoutes.prototype.edit;
export type SendPollMessageRoute = typeof MessageRoutes.prototype.sendPoll;
