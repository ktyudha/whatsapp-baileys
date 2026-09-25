import pino from "pino";
import pinoPretty from "pino-pretty";

const isDev = process.env.NODE_ENV !== "production";

const stream = isDev
  ? pinoPretty({
    colorize: true,
    translateTime: "SYS:standard",
    ignore: "pid,hostname",
  })
  : undefined;

const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
  },
  stream,
);

export const log = {
  error: (msg: string, mergingObject?: Record<string, unknown>) =>
    logger.error(mergingObject ?? {}, msg),
  warn: (msg: string, mergingObject?: Record<string, unknown>) =>
    logger.warn(mergingObject ?? {}, msg),
  info: (msg: string, mergingObject?: Record<string, unknown>) =>
    logger.info(mergingObject ?? {}, msg),
};
