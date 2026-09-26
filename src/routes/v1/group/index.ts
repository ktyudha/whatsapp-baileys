import { createRouter } from "@core/app.core";
import * as groupController from "@controllers/v1/group.controller";
import { GroupRoutes } from "./group.routes";

const routes = new GroupRoutes();

const router = createRouter()
  .openapi(routes.create, groupController.create)
  .openapi(routes.getAllGroups, groupController.getAllGroups)
  .openapi(routes.joinByCode, groupController.joinByCode)
  .openapi(routes.inviteInfo, groupController.inviteInfo)
  .openapi(routes.getMetadata, groupController.getMetadata)
  .openapi(routes.updateParticipants, groupController.updateParticipants)
  .openapi(routes.updateSubject, groupController.updateSubject)
  .openapi(routes.updateDescription, groupController.updateDescription)
  .openapi(routes.updateSetting, groupController.updateSetting)
  .openapi(routes.updateMemberAddMode, groupController.updateMemberAddMode)
  .openapi(routes.updateEphemeral, groupController.updateEphemeral)
  .openapi(routes.leave, groupController.leave)
  .openapi(routes.getInviteLink, groupController.getInviteLink)
  .openapi(routes.revokeInviteLink, groupController.revokeInviteLink)
  .openapi(routes.listJoinRequests, groupController.listJoinRequests)
  .openapi(routes.updateJoinRequests, groupController.updateJoinRequests);

export default router;
