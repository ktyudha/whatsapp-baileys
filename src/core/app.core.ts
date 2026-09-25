import type { Hono } from "hono";
import env from "@/config/env.config";
import { log } from "@core/helpers/index.helper";

import { OpenAPIHono } from "@hono/zod-openapi";

export function createRouter() {
  return new OpenAPIHono();
}

export default function createApp(app: Hono<any, any, any>) {
  const port = env.PORT;

  log.info(`Server: running on port ${port}!`);

  Bun.serve({
    fetch: app.fetch,
    port,
  });
}
