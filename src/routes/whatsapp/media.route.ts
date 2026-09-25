import { createRouter } from "@core/app.core";
import * as mediaController from "@controllers/whatsapp/media.controller";
import { MediaRoutes } from "./media.routes";

const routes = new MediaRoutes();

const router = createRouter()
  .openapi(routes.sendImage, mediaController.sendImage)
  .openapi(routes.sendVideo, mediaController.sendVideo)
  .openapi(routes.sendAudio, mediaController.sendAudio)
  .openapi(routes.sendDocument, mediaController.sendDocument)
  .openapi(routes.sendSticker, mediaController.sendSticker);

export default router;
