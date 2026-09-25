import { Hono } from "hono";
import { log } from "@core/helpers/index.helper";

import { OpenAPIHono } from "@hono/zod-openapi";

export function createRouter() {
  return new OpenAPIHono();
}

export default function createApp(app: Hono) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  log.info(`Server: running on port ${port}!`);

  Bun.serve({
    fetch: app.fetch,
    port,
  });
}
