import { createRouter } from "@core/app.core";
import * as privacyController from "@controllers/v1/privacy.controller";
import { PrivacyRoutes } from "./privacy.routes";

const routes = new PrivacyRoutes();

const router = createRouter()
  .openapi(routes.block, privacyController.block)
  .openapi(routes.unblock, privacyController.unblock)
  .openapi(routes.getSettings, privacyController.getSettings)
  .openapi(routes.getBlocklist, privacyController.getBlocklist)
  .openapi(routes.updateLastSeen, privacyController.updateLastSeen)
  .openapi(routes.updateOnline, privacyController.updateOnline)
  .openapi(routes.updateProfilePicture, privacyController.updateProfilePicture)
  .openapi(routes.updateStatus, privacyController.updateStatus)
  .openapi(routes.updateReadReceipts, privacyController.updateReadReceipts)
  .openapi(routes.updateGroupsAdd, privacyController.updateGroupsAdd)
  .openapi(routes.updateCalls, privacyController.updateCalls)
  .openapi(routes.updateMessages, privacyController.updateMessages)
  .openapi(routes.updateDisappearingMode, privacyController.updateDisappearingMode);

export default router;
