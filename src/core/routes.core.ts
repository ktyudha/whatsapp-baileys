import { Hono } from "hono";

import { currentYear } from "@core/helpers/index.helper";


export default function coreRoutes(app: Hono) {
  app.get("/", (c) => c.text(`WHATSAPP BAILEYS - @ ${currentYear} Kurniawan Try Yudha`));
  app.get("/status", (c) => c.json({ status: "ok" }));
}
