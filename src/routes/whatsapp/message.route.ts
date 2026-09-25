import { Hono } from "hono";

import * as messageController from "@controllers/whatsapp/message.controller";

export default function messageRoutes(app: Hono) {
  app.post("/messages/text", messageController.sendText);
  app.post("/messages/delete", messageController.remove);
  app.post("/messages/edit", messageController.edit);
  app.post("/messages/poll", messageController.sendPollMessage);
}
