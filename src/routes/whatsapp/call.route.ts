import { Hono } from "hono";

import * as callController from "@controllers/whatsapp/call.controller";

export default function callRoutes(app: Hono) {
  app.post("/calls/reject", callController.reject);
}
