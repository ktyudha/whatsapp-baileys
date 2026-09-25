import { createRoute } from "@hono/zod-openapi";

import jsonContentRequired from "@core/helpers/json-content-required.helper";
import { anySuccessResponse, nullSuccessResponse } from "@core/schemas/common.schema";
import {
  blockContactSchema,
  updateCallPrivacySchema,
  updateDisappearingModeSchema,
  updateGroupsAddPrivacySchema,
  updateMessagesPrivacySchema,
  updateOnlinePrivacySchema,
  updatePrivacyValueSchema,
  updateReadReceiptsPrivacySchema,
} from "@core/schemas/privacy.schema";
import { BaseRoutes } from "@routes/base.route";

export class PrivacyRoutes extends BaseRoutes {
  block = createRoute({
    tags: ["Privacy"],
    description: "Block a contact",
    path: "/privacy/block",
    method: "post",
    request: { body: jsonContentRequired(blockContactSchema, "Block payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Contact blocked"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  unblock = createRoute({
    tags: ["Privacy"],
    description: "Unblock a contact",
    path: "/privacy/unblock",
    method: "post",
    request: { body: jsonContentRequired(blockContactSchema, "Unblock payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Contact unblocked"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  getSettings = createRoute({
    tags: ["Privacy"],
    description: "Get current privacy settings",
    path: "/privacy/settings",
    method: "get",
    responses: {
      200: this.successResponse(anySuccessResponse, "Privacy settings retrieved"),
      500: this.errorResponse("Failed to fetch privacy settings"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  getBlocklist = createRoute({
    tags: ["Privacy"],
    description: "Get the blocked contacts list",
    path: "/privacy/blocklist",
    method: "get",
    responses: {
      200: this.successResponse(anySuccessResponse, "Blocklist retrieved"),
      500: this.errorResponse("Failed to fetch blocklist"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateLastSeen = createRoute({
    tags: ["Privacy"],
    description: "Update last seen privacy",
    path: "/privacy/last-seen",
    method: "patch",
    request: { body: jsonContentRequired(updatePrivacyValueSchema, "Privacy value payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Last seen privacy updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateOnline = createRoute({
    tags: ["Privacy"],
    description: "Update online privacy",
    path: "/privacy/online",
    method: "patch",
    request: { body: jsonContentRequired(updateOnlinePrivacySchema, "Privacy value payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Online privacy updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateProfilePicture = createRoute({
    tags: ["Privacy"],
    description: "Update profile picture privacy",
    path: "/privacy/profile-picture",
    method: "patch",
    request: { body: jsonContentRequired(updatePrivacyValueSchema, "Privacy value payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Profile picture privacy updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateStatus = createRoute({
    tags: ["Privacy"],
    description: "Update status (stories) privacy",
    path: "/privacy/status",
    method: "patch",
    request: { body: jsonContentRequired(updatePrivacyValueSchema, "Privacy value payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Status privacy updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateReadReceipts = createRoute({
    tags: ["Privacy"],
    description: "Update read receipts privacy",
    path: "/privacy/read-receipts",
    method: "patch",
    request: { body: jsonContentRequired(updateReadReceiptsPrivacySchema, "Privacy value payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Read receipts privacy updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateGroupsAdd = createRoute({
    tags: ["Privacy"],
    description: "Update who can add you to groups",
    path: "/privacy/groups-add",
    method: "patch",
    request: { body: jsonContentRequired(updateGroupsAddPrivacySchema, "Privacy value payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Groups add privacy updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateCalls = createRoute({
    tags: ["Privacy"],
    description: "Update call privacy",
    path: "/privacy/calls",
    method: "patch",
    request: { body: jsonContentRequired(updateCallPrivacySchema, "Privacy value payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Call privacy updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateMessages = createRoute({
    tags: ["Privacy"],
    description: "Update who can message you",
    path: "/privacy/messages",
    method: "patch",
    request: { body: jsonContentRequired(updateMessagesPrivacySchema, "Privacy value payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Messages privacy updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateDisappearingMode = createRoute({
    tags: ["Privacy"],
    description: "Update default disappearing messages duration for new chats",
    path: "/privacy/disappearing-mode",
    method: "patch",
    request: { body: jsonContentRequired(updateDisappearingModeSchema, "Disappearing mode payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Default disappearing mode updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });
}

export type BlockContactRoute = typeof PrivacyRoutes.prototype.block;
export type UnblockContactRoute = typeof PrivacyRoutes.prototype.unblock;
export type GetPrivacySettingsRoute = typeof PrivacyRoutes.prototype.getSettings;
export type GetBlocklistRoute = typeof PrivacyRoutes.prototype.getBlocklist;
export type UpdateLastSeenRoute = typeof PrivacyRoutes.prototype.updateLastSeen;
export type UpdateOnlineRoute = typeof PrivacyRoutes.prototype.updateOnline;
export type UpdateProfilePictureRoute = typeof PrivacyRoutes.prototype.updateProfilePicture;
export type UpdateStatusRoute = typeof PrivacyRoutes.prototype.updateStatus;
export type UpdateReadReceiptsRoute = typeof PrivacyRoutes.prototype.updateReadReceipts;
export type UpdateGroupsAddRoute = typeof PrivacyRoutes.prototype.updateGroupsAdd;
export type UpdateCallsRoute = typeof PrivacyRoutes.prototype.updateCalls;
export type UpdateMessagesRoute = typeof PrivacyRoutes.prototype.updateMessages;
export type UpdateDisappearingModeRoute = typeof PrivacyRoutes.prototype.updateDisappearingMode;
