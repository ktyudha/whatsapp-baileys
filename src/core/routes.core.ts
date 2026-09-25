import type { Hono } from "hono";

import { currentYear } from "@core/helpers/index.helper";

export default function coreRoutes(app: Hono<any, any, any>) {
  app.get("/", (c) => c.text(`WHATSAPP BAILEYS - @ ${currentYear} Kurniawan Try Yudha`));
  app.get("/status", (c) => c.json({ status: "ok" }));
}
