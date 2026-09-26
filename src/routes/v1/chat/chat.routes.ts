import { createRoute } from "@hono/zod-openapi";

import jsonContentRequired from "@core/helpers/json-content-required.helper";
import {
  archiveChatSchema,
  deleteChatSchema,
  markReadSchema,
  muteChatSchema,
  pinChatSchema,
  sendPresenceSchema,
  subscribePresenceSchema,
} from "@core/schemas/chat.schema";
import { nullSuccessResponse } from "@core/schemas/common.schema";
import { BaseRoutes } from "@routes/base.route";

export class ChatRoutes extends BaseRoutes {
  markRead = createRoute({
    tags: ["Chat"],
    description: "Mark messages as read",
    path: "/chat/read",
    method: "post",
    request: { body: jsonContentRequired(markReadSchema, "Message keys to mark as read") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Chat marked as read"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  archive = createRoute({
    tags: ["Chat"],
    description: "Archive or unarchive a chat",
    path: "/chat/archive",
    method: "post",
    request: { body: jsonContentRequired(archiveChatSchema, "Archive payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Chat archive updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  mute = createRoute({
    tags: ["Chat"],
    description: "Mute or unmute a chat",
    path: "/chat/mute",
    method: "post",
    request: { body: jsonContentRequired(muteChatSchema, "Mute payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Chat mute updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  pin = createRoute({
    tags: ["Chat"],
    description: "Pin or unpin a chat",
    path: "/chat/pin",
    method: "post",
    request: { body: jsonContentRequired(pinChatSchema, "Pin payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Chat pin updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  delete = createRoute({
    tags: ["Chat"],
    description: "Delete a chat",
    path: "/chat/delete",
    method: "post",
    request: { body: jsonContentRequired(deleteChatSchema, "Delete payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Chat deleted"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  subscribePresence = createRoute({
    tags: ["Chat"],
    description: "Subscribe to a contact's presence updates",
    path: "/chat/presence/subscribe",
    method: "post",
    request: { body: jsonContentRequired(subscribePresenceSchema, "Subscribe payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Subscribed to presence"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  sendPresence = createRoute({
    tags: ["Chat"],
    description: "Update presence (typing/recording/online) shown to a chat",
    path: "/chat/presence",
    method: "post",
    request: { body: jsonContentRequired(sendPresenceSchema, "Presence payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Presence updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });
}

export type MarkReadRoute = typeof ChatRoutes.prototype.markRead;
export type ArchiveChatRoute = typeof ChatRoutes.prototype.archive;
export type MuteChatRoute = typeof ChatRoutes.prototype.mute;
export type PinChatRoute = typeof ChatRoutes.prototype.pin;
export type DeleteChatRoute = typeof ChatRoutes.prototype.delete;
export type SubscribePresenceRoute = typeof ChatRoutes.prototype.subscribePresence;
export type SendPresenceRoute = typeof ChatRoutes.prototype.sendPresence;
