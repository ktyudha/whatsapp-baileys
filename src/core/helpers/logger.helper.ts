import pino from "pino";
import pinoPretty from "pino-pretty";

import env from "@/config/env.config";

const pretty = pinoPretty({
  colorize: true,
  translateTime: "SYS:standard",
  ignore: "pid,hostname",
});

export const logger = pino(
  {
    level: env.LOG_LEVEL,
  },
  pretty,
);

export const log = {
  error: (msg: string, mergingObject?: Record<string, unknown>) =>
    logger.error(mergingObject ?? {}, msg),
  warn: (msg: string, mergingObject?: Record<string, unknown>) =>
    logger.warn(mergingObject ?? {}, msg),
  info: (msg: string, mergingObject?: Record<string, unknown>) =>
    logger.info(mergingObject ?? {}, msg),
  debug: (msg: string, mergingObject?: Record<string, unknown>) =>
    logger.debug(mergingObject ?? {}, msg),
};
