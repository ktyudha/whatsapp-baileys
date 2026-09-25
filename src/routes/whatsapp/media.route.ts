import { Hono } from "hono";

import * as mediaController from "@controllers/whatsapp/media.controller";

export default function mediaRoutes(app: Hono) {
  app.post("/media/image", mediaController.sendImage);
  app.post("/media/video", mediaController.sendVideo);
  app.post("/media/audio", mediaController.sendAudio);
  app.post("/media/document", mediaController.sendDocument);
  app.post("/media/sticker", mediaController.sendSticker);
}
