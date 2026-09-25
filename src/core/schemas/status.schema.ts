import { z } from "@hono/zod-openapi";

import { createSuccessResponseSchema } from "@core/schemas/base.schema";

export const socketStatusSchema = z
  .object({
    connected: z.boolean().openapi({ example: true }),
  })
  .openapi("SocketStatus");

export const socketStatusSuccessResponse = createSuccessResponseSchema(socketStatusSchema);
