import type { Hono } from "hono";

import { currentYear } from "@core/helpers/index.helper";
import v1Routes from "@routes/v1/index";

const apiVersions = {
  v1: v1Routes,
  // v2: v2Routes,
};

export default function coreRoutes(app: Hono<any, any, any>) {
  app.get("/", (c) => c.text(`WHATSAPP BAILEYS - @${currentYear} Kurniawan Try Yudha`));
  app.get("/status", (c) => c.json({ status: "ok" }));

  for (const [version, router] of Object.entries(apiVersions)) {
    app.route(`/api/${version}`, router);
  }
}
