import { createRouter } from "@core/app.core";
import * as messageController from "@controllers/whatsapp/message.controller";
import { MessageRoutes } from "./message.routes";

const routes = new MessageRoutes();

const router = createRouter()
  .openapi(routes.sendText, messageController.sendText)
  .openapi(routes.delete, messageController.remove)
  .openapi(routes.edit, messageController.edit)
  .openapi(routes.sendPoll, messageController.sendPollMessage);

export default router;
