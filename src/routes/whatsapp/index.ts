import type { Hono } from "hono";

import statusRoutes from "./status.route";
import messageRoutes from "./message.route";
import mediaRoutes from "./media.route";
import socialRoutes from "./social.route";
import chatRoutes from "./chat.route";
import groupRoutes from "./group.route";
import broadcastRoutes from "./broadcast.route";
import privacyRoutes from "./privacy.route";
import callRoutes from "./call.route";

export default function whatsappRoutes(app: Hono<any, any, any>) {
  app.route("/api/whatsapp", statusRoutes);
  app.route("/api/whatsapp", messageRoutes);
  app.route("/api/whatsapp", mediaRoutes);
  app.route("/api/whatsapp", socialRoutes);
  app.route("/api/whatsapp", chatRoutes);
  app.route("/api/whatsapp", groupRoutes);
  app.route("/api/whatsapp", broadcastRoutes);
  app.route("/api/whatsapp", privacyRoutes);
  app.route("/api/whatsapp", callRoutes);
}
