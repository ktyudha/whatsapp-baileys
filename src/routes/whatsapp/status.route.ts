import { Hono } from "hono";

import * as statusController from "@controllers/whatsapp/status.controller";

export default function statusRoutes(app: Hono) {
  app.get("/status", statusController.getStatus);
}
