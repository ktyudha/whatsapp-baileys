import { z } from "zod";

const booleanEnv = (defaultValue: boolean) =>
  z
    .enum(["true", "false"])
    .default(defaultValue ? "true" : "false")
    .transform((value) => value === "true");

const jidListEnv = () =>
  z
    .string()
    .optional()
    .transform(
      (value) =>
        value
          ?.split(",")
          .map((jid) => jid.trim())
          .filter(Boolean) ?? [],
    );

export const EnvSchema = z.object({
  APP_NAME: z.string().default("whatsapp-baileys"),
  NODE_ENV: z.string().default("development").readonly(),
  LOG_LEVEL: z.string().default("info"),
  PORT: z.coerce.number().default(3000),

  // WHATSAPP
  WA_AUTH_DIR: z.string().default("auth_info_baileys"),
  WA_PAIRING_NUMBER: z
    .string()
    .optional()
    .transform((value) => value?.replace(/\D/g, "") || undefined),
  WA_RECONNECT_DELAY_MS: z.coerce.number().default(3000),
  WA_BROWSER_PLATFORM: z
    .enum(["ubuntu", "macOS", "windows", "baileys", "appropriate"])
    .default("ubuntu"),
  WA_MARK_ONLINE_ON_CONNECT: booleanEnv(false),
  WA_SYNC_FULL_HISTORY: booleanEnv(false),
  WA_IGNORE_BROADCAST: booleanEnv(true),
  WA_MAX_MSG_RETRY_COUNT: z.coerce.number().default(5),
  WA_CONNECT_TIMEOUT_MS: z.coerce.number().default(20_000),
  WA_QUERY_TIMEOUT_MS: z.coerce.number().default(60_000),
  WA_KEEP_ALIVE_INTERVAL_MS: z.coerce.number().default(30_000),
  WA_MESSAGE_CACHE_TTL_S: z.coerce.number().default(3600),
  WA_GROUP_CACHE_TTL_S: z.coerce.number().default(300),

  // WHATSAPP - AUTO REPLY
  WA_AUTO_REPLY_ENABLED: booleanEnv(true),
  WA_AUTO_REPLY_MESSAGE: z.string().default("Hello from Baileys!"),

  // WHATSAPP - FORWARDING
  WA_FORWARD_ENABLED: booleanEnv(false),
  WA_FORWARD_SOURCE_WHITELIST: jidListEnv(),
  WA_FORWARD_TARGET_JIDS: jidListEnv(),

  // WHATSAPP - CALLS
  WA_REJECT_CALLS: booleanEnv(false),

  // WHATSAPP - REDIRECT TO GROUP
  WA_REDIRECT_GROUP_ID: z.string().optional(),
  WA_REDIRECT_MAP_TTL_S: z.coerce.number().default(86_400),

  // WHATSAPP - COMMANDS
  WA_COMMAND_PREFIX: z.string().default("!"),
  WA_COMMAND_ADMIN_JIDS: jidListEnv(),
});

export type Environment = z.infer<typeof EnvSchema>;
export type ParseEnvParams = Record<string, string | undefined>;
