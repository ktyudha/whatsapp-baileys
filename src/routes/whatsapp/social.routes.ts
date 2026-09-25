import { createRoute } from "@hono/zod-openapi";

import jsonContentRequired from "@core/helpers/json-content-required.helper";
import { anySuccessResponse } from "@core/schemas/common.schema";
import {
  pinMessageSchema,
  reactSchema,
  sendContactSchema,
  sendGroupInviteSchema,
  sendLocationSchema,
  unpinMessageSchema,
  unreactSchema,
} from "@core/schemas/social.schema";
import { BaseRoutes } from "@routes/base.route";

export class SocialRoutes extends BaseRoutes {
  react = createRoute({
    tags: ["Social"],
    description: "React to a message with an emoji",
    path: "/social/react",
    method: "post",
    request: { body: jsonContentRequired(reactSchema, "React payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Reaction sent"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to send reaction"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  unreact = createRoute({
    tags: ["Social"],
    description: "Remove a reaction from a message",
    path: "/social/react/remove",
    method: "post",
    request: { body: jsonContentRequired(unreactSchema, "Remove reaction payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Reaction removed"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to remove reaction"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  sendLocation = createRoute({
    tags: ["Social"],
    description: "Send a location message",
    path: "/social/location",
    method: "post",
    request: { body: jsonContentRequired(sendLocationSchema, "Location payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Location sent"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to send location"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  sendContact = createRoute({
    tags: ["Social"],
    description: "Send one or more contact cards",
    path: "/social/contact",
    method: "post",
    request: { body: jsonContentRequired(sendContactSchema, "Contact payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Contact sent"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to send contact"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  sendGroupInvite = createRoute({
    tags: ["Social"],
    description: "Send a group invite message",
    path: "/social/group-invite",
    method: "post",
    request: { body: jsonContentRequired(sendGroupInviteSchema, "Group invite payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Group invite sent"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to send group invite"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  pin = createRoute({
    tags: ["Social"],
    description: "Pin a message in a chat",
    path: "/social/pin",
    method: "post",
    request: { body: jsonContentRequired(pinMessageSchema, "Pin payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Message pinned"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to pin message"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  unpin = createRoute({
    tags: ["Social"],
    description: "Unpin a message in a chat",
    path: "/social/unpin",
    method: "post",
    request: { body: jsonContentRequired(unpinMessageSchema, "Unpin payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Message unpinned"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to unpin message"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });
}

export type ReactRoute = typeof SocialRoutes.prototype.react;
export type UnreactRoute = typeof SocialRoutes.prototype.unreact;
export type SendLocationRoute = typeof SocialRoutes.prototype.sendLocation;
export type SendContactRoute = typeof SocialRoutes.prototype.sendContact;
export type SendGroupInviteRoute = typeof SocialRoutes.prototype.sendGroupInvite;
export type PinMessageRoute = typeof SocialRoutes.prototype.pin;
export type UnpinMessageRoute = typeof SocialRoutes.prototype.unpin;
