import { Hono } from "hono";

import * as privacyController from "@controllers/whatsapp/privacy.controller";

export default function privacyRoutes(app: Hono) {
  app.post("/privacy/block", privacyController.block);
  app.post("/privacy/unblock", privacyController.unblock);
  app.get("/privacy/settings", privacyController.getSettings);
  app.get("/privacy/blocklist", privacyController.getBlocklist);
  app.patch("/privacy/last-seen", privacyController.updateLastSeen);
  app.patch("/privacy/online", privacyController.updateOnline);
  app.patch("/privacy/profile-picture", privacyController.updateProfilePicture);
  app.patch("/privacy/status", privacyController.updateStatus);
  app.patch("/privacy/read-receipts", privacyController.updateReadReceipts);
  app.patch("/privacy/groups-add", privacyController.updateGroupsAdd);
  app.patch("/privacy/calls", privacyController.updateCalls);
  app.patch("/privacy/messages", privacyController.updateMessages);
  app.patch("/privacy/disappearing-mode", privacyController.updateDisappearingMode);
}
