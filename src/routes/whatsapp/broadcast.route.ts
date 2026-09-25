import { Hono } from "hono";

import * as broadcastController from "@controllers/whatsapp/broadcast.controller";

export default function broadcastRoutes(app: Hono) {
  app.post("/broadcast/status", broadcastController.postStatus);
  app.post("/broadcast/list/send", broadcastController.sendToList);
  app.delete("/broadcast/list/:jid", broadcastController.deleteList);
}
