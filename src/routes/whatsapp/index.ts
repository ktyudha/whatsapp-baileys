import { Hono } from "hono";

import statusRoutes from "./status.route";
import messageRoutes from "./message.route";
import mediaRoutes from "./media.route";
import socialRoutes from "./social.route";
import chatRoutes from "./chat.route";
import groupRoutes from "./group.route";
import broadcastRoutes from "./broadcast.route";
import privacyRoutes from "./privacy.route";
import callRoutes from "./call.route";

export default function whatsappRoutes(app: Hono) {
  const whatsapp = new Hono();

  statusRoutes(whatsapp);
  messageRoutes(whatsapp);
  mediaRoutes(whatsapp);
  socialRoutes(whatsapp);
  chatRoutes(whatsapp);
  groupRoutes(whatsapp);
  broadcastRoutes(whatsapp);
  privacyRoutes(whatsapp);
  callRoutes(whatsapp);

  app.route("/api/whatsapp", whatsapp);
}
