import type { z } from "@hono/zod-openapi";
import { baseErrorResponseSchema } from "@/core/schemas/base.schema";

export class BaseRoutes {
  protected successResponse<T extends z.ZodTypeAny>(
    dataSchema: T,
    description: string,
  ) {
    return {
      content: {
        "application/json": {
          schema: dataSchema,
        },
      },
      description,
    };
  }

  protected errorResponse(description: string) {
    return {
      content: {
        "application/json": {
          schema: baseErrorResponseSchema,
        },
      },
      description,
    };
  }
}
