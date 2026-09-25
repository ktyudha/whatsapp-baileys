import { createRouter } from "@core/app.core";
import * as broadcastController from "@controllers/whatsapp/broadcast.controller";
import { BroadcastRoutes } from "./broadcast.routes";

const routes = new BroadcastRoutes();

const router = createRouter()
  .openapi(routes.postStatus, broadcastController.postStatus)
  .openapi(routes.sendToList, broadcastController.sendToList)
  .openapi(routes.deleteList, broadcastController.deleteList);

export default router;
