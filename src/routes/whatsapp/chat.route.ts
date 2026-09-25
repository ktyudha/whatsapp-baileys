import { Hono } from "hono";

import * as chatController from "@controllers/whatsapp/chat.controller";

export default function chatRoutes(app: Hono) {
  app.post("/chat/read", chatController.markRead);
  app.post("/chat/archive", chatController.archive);
  app.post("/chat/mute", chatController.mute);
  app.post("/chat/pin", chatController.pin);
  app.post("/chat/delete", chatController.remove);
  app.post("/chat/presence/subscribe", chatController.subscribePresence);
  app.post("/chat/presence", chatController.sendPresence);
}
