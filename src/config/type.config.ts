import { z } from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z.string().default("development").readonly(),

  // MQTT
  MQTT_PROTOCOL: z.string().default("mqtt"),
  MQTT_PORT: z.string().default("1883"),
  MQTT_HOST: z.string().min(1),
  MQTT_USERNAME: z.string().min(1),
  MQTT_PASSWORD: z.string().min(1),

  // POSTGRES
  POSTGRES_HOST: z.string().readonly(),
  POSTGRES_DB: z.string().readonly(),
  POSTGRES_USER: z.string().readonly(),
  POSTGRES_PASSWORD: z.string().readonly(),
  POSTGRES_PORT: z.string().default("5432").readonly(),

  // JWT
  JWT_SECRET: z.string().default("courier-hono"),
  REFRESH_SECRET: z.string().default("courier-hono-refresh"),
  ACCESS_TOKEN_EXPIRE_MS: z.string().default("300000"),
  REFRESH_TOKEN_EXPIRE_MS: z.string().default("604800000"),

  // REDIS
  // REDIS_URL: z.string().url().optional(),
});

export type Environment = z.infer<typeof EnvSchema>;
export type ParseEnvParams = Record<string, string | undefined>;
