import type { z } from "@hono/zod-openapi";

export default function jsonContentRequired<T extends z.ZodTypeAny>(schema: T, description: string) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
    required: true,
  };
}
