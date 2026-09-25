import { Hono } from "hono";

import * as groupController from "@controllers/whatsapp/group.controller";

export default function groupRoutes(app: Hono) {
  app.post("/groups", groupController.create);
  app.get("/groups", groupController.getAllGroups);
  app.post("/groups/join", groupController.joinByCode);
  app.get("/groups/invite-info/:code", groupController.inviteInfo);

  app.get("/groups/:jid", groupController.getMetadata);
  app.post("/groups/:jid/participants", groupController.updateParticipants);
  app.patch("/groups/:jid/subject", groupController.updateSubject);
  app.patch("/groups/:jid/description", groupController.updateDescription);
  app.patch("/groups/:jid/setting", groupController.updateSetting);
  app.patch("/groups/:jid/member-add-mode", groupController.updateMemberAddMode);
  app.patch("/groups/:jid/ephemeral", groupController.updateEphemeral);
  app.post("/groups/:jid/leave", groupController.leave);
  app.get("/groups/:jid/invite-link", groupController.getInviteLink);
  app.post("/groups/:jid/invite-link/revoke", groupController.revokeInviteLink);
  app.get("/groups/:jid/join-requests", groupController.listJoinRequests);
  app.post("/groups/:jid/join-requests", groupController.updateJoinRequests);
}
