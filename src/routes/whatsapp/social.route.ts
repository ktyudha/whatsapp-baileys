import { Hono } from "hono";

import * as socialController from "@controllers/whatsapp/social.controller";

export default function socialRoutes(app: Hono) {
  app.post("/social/react", socialController.react);
  app.post("/social/react/remove", socialController.unreact);
  app.post("/social/location", socialController.sendLocation);
  app.post("/social/contact", socialController.sendContact);
  app.post("/social/group-invite", socialController.sendGroupInvite);
  app.post("/social/pin", socialController.pin);
  app.post("/social/unpin", socialController.unpin);
}
