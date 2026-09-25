import { createRouter } from "@core/app.core";
import * as chatController from "@controllers/whatsapp/chat.controller";
import { ChatRoutes } from "./chat.routes";

const routes = new ChatRoutes();

const router = createRouter()
  .openapi(routes.markRead, chatController.markRead)
  .openapi(routes.archive, chatController.archive)
  .openapi(routes.mute, chatController.mute)
  .openapi(routes.pin, chatController.pin)
  .openapi(routes.delete, chatController.remove)
  .openapi(routes.subscribePresence, chatController.subscribePresence)
  .openapi(routes.sendPresence, chatController.sendPresence);

export default router;
