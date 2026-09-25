import { createRouter } from "@core/app.core";
import * as socialController from "@controllers/whatsapp/social.controller";
import { SocialRoutes } from "./social.routes";

const routes = new SocialRoutes();

const router = createRouter()
  .openapi(routes.react, socialController.react)
  .openapi(routes.unreact, socialController.unreact)
  .openapi(routes.sendLocation, socialController.sendLocation)
  .openapi(routes.sendContact, socialController.sendContact)
  .openapi(routes.sendGroupInvite, socialController.sendGroupInvite)
  .openapi(routes.pin, socialController.pin)
  .openapi(routes.unpin, socialController.unpin);

export default router;
