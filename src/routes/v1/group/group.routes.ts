import { createRoute } from "@hono/zod-openapi";

import jsonContentRequired from "@core/helpers/json-content-required.helper";
import { anySuccessResponse, nullSuccessResponse } from "@core/schemas/common.schema";
import {
  createGroupSchema,
  groupJidParamsSchema,
  inviteCodeParamsSchema,
  inviteLinkSuccessResponse,
  joinByCodeSchema,
  joinedGroupSuccessResponse,
  updateDescriptionSchema,
  updateEphemeralSchema,
  updateJoinRequestsSchema,
  updateMemberAddModeSchema,
  updateParticipantsSchema,
  updateSettingSchema,
  updateSubjectSchema,
} from "@core/schemas/group.schema";
import { BaseRoutes } from "@routes/base.route";

export class GroupRoutes extends BaseRoutes {
  create = createRoute({
    tags: ["Group"],
    description: "Create a new group",
    path: "/groups",
    method: "post",
    request: { body: jsonContentRequired(createGroupSchema, "Create group payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Group created"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to create group"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  getAllGroups = createRoute({
    tags: ["Group"],
    description: "List all groups the bot participates in",
    path: "/groups",
    method: "get",
    responses: {
      200: this.successResponse(anySuccessResponse, "Groups retrieved"),
      500: this.errorResponse("Failed to fetch participating groups"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  joinByCode = createRoute({
    tags: ["Group"],
    description: "Join a group using an invite code",
    path: "/groups/join",
    method: "post",
    request: { body: jsonContentRequired(joinByCodeSchema, "Invite code payload") },
    responses: {
      200: this.successResponse(joinedGroupSuccessResponse, "Joined group"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Failed to join group"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  inviteInfo = createRoute({
    tags: ["Group"],
    description: "Get info about a group invite code",
    path: "/groups/invite-info/{code}",
    method: "get",
    request: { params: inviteCodeParamsSchema },
    responses: {
      200: this.successResponse(anySuccessResponse, "Invite info retrieved"),
      404: this.errorResponse("Invite info not found"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  getMetadata = createRoute({
    tags: ["Group"],
    description: "Get a group's metadata",
    path: "/groups/{jid}",
    method: "get",
    request: { params: groupJidParamsSchema },
    responses: {
      200: this.successResponse(anySuccessResponse, "Group metadata retrieved"),
      404: this.errorResponse("Group not found"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateParticipants = createRoute({
    tags: ["Group"],
    description: "Add, remove, promote or demote group participants",
    path: "/groups/{jid}/participants",
    method: "post",
    request: { params: groupJidParamsSchema, body: jsonContentRequired(updateParticipantsSchema, "Participants payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Group participants updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateSubject = createRoute({
    tags: ["Group"],
    description: "Update a group's subject (name)",
    path: "/groups/{jid}/subject",
    method: "patch",
    request: { params: groupJidParamsSchema, body: jsonContentRequired(updateSubjectSchema, "Subject payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Group subject updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateDescription = createRoute({
    tags: ["Group"],
    description: "Update a group's description",
    path: "/groups/{jid}/description",
    method: "patch",
    request: { params: groupJidParamsSchema, body: jsonContentRequired(updateDescriptionSchema, "Description payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Group description updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateSetting = createRoute({
    tags: ["Group"],
    description: "Update who can send messages / edit group info",
    path: "/groups/{jid}/setting",
    method: "patch",
    request: { params: groupJidParamsSchema, body: jsonContentRequired(updateSettingSchema, "Setting payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Group setting updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateMemberAddMode = createRoute({
    tags: ["Group"],
    description: "Update who can add new members",
    path: "/groups/{jid}/member-add-mode",
    method: "patch",
    request: { params: groupJidParamsSchema, body: jsonContentRequired(updateMemberAddModeSchema, "Member add mode payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Group member add mode updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateEphemeral = createRoute({
    tags: ["Group"],
    description: "Update disappearing messages duration",
    path: "/groups/{jid}/ephemeral",
    method: "patch",
    request: { params: groupJidParamsSchema, body: jsonContentRequired(updateEphemeralSchema, "Ephemeral payload") },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Group ephemeral messages updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  leave = createRoute({
    tags: ["Group"],
    description: "Leave a group",
    path: "/groups/{jid}/leave",
    method: "post",
    request: { params: groupJidParamsSchema },
    responses: {
      200: this.successResponse(nullSuccessResponse, "Left group"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  getInviteLink = createRoute({
    tags: ["Group"],
    description: "Get a group's invite link",
    path: "/groups/{jid}/invite-link",
    method: "get",
    request: { params: groupJidParamsSchema },
    responses: {
      200: this.successResponse(inviteLinkSuccessResponse, "Invite link retrieved"),
      500: this.errorResponse("Failed to get group invite link"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  revokeInviteLink = createRoute({
    tags: ["Group"],
    description: "Revoke and regenerate a group's invite link",
    path: "/groups/{jid}/invite-link/revoke",
    method: "post",
    request: { params: groupJidParamsSchema },
    responses: {
      200: this.successResponse(inviteLinkSuccessResponse, "Invite link revoked"),
      500: this.errorResponse("Failed to revoke invite link"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  listJoinRequests = createRoute({
    tags: ["Group"],
    description: "List pending join requests",
    path: "/groups/{jid}/join-requests",
    method: "get",
    request: { params: groupJidParamsSchema },
    responses: {
      200: this.successResponse(anySuccessResponse, "Join requests retrieved"),
      500: this.errorResponse("Failed to list join requests"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });

  updateJoinRequests = createRoute({
    tags: ["Group"],
    description: "Approve or reject pending join requests",
    path: "/groups/{jid}/join-requests",
    method: "post",
    request: { params: groupJidParamsSchema, body: jsonContentRequired(updateJoinRequestsSchema, "Join requests payload") },
    responses: {
      200: this.successResponse(anySuccessResponse, "Join requests updated"),
      422: this.errorResponse("Validation error"),
      500: this.errorResponse("Internal error"),
      503: this.errorResponse("WhatsApp socket not connected"),
    },
  });
}

export type CreateGroupRoute = typeof GroupRoutes.prototype.create;
export type GetAllGroupsRoute = typeof GroupRoutes.prototype.getAllGroups;
export type JoinByCodeRoute = typeof GroupRoutes.prototype.joinByCode;
export type InviteInfoRoute = typeof GroupRoutes.prototype.inviteInfo;
export type GetGroupMetadataRoute = typeof GroupRoutes.prototype.getMetadata;
export type UpdateParticipantsRoute = typeof GroupRoutes.prototype.updateParticipants;
export type UpdateSubjectRoute = typeof GroupRoutes.prototype.updateSubject;
export type UpdateDescriptionRoute = typeof GroupRoutes.prototype.updateDescription;
export type UpdateSettingRoute = typeof GroupRoutes.prototype.updateSetting;
export type UpdateMemberAddModeRoute = typeof GroupRoutes.prototype.updateMemberAddMode;
export type UpdateEphemeralRoute = typeof GroupRoutes.prototype.updateEphemeral;
export type LeaveGroupRoute = typeof GroupRoutes.prototype.leave;
export type GetInviteLinkRoute = typeof GroupRoutes.prototype.getInviteLink;
export type RevokeInviteLinkRoute = typeof GroupRoutes.prototype.revokeInviteLink;
export type ListJoinRequestsRoute = typeof GroupRoutes.prototype.listJoinRequests;
export type UpdateJoinRequestsRoute = typeof GroupRoutes.prototype.updateJoinRequests;
