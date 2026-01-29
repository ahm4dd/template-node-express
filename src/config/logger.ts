import { createRequire } from "node:module";
import pino from "pino";
import { env } from "./env.js";

const isDev = env.NODE_ENV === "development";
const require = createRequire(import.meta.url);
const prettyTarget = (() => {
  try {
    require.resolve("pino-pretty");
    return "pino-pretty";
  } catch {
    return null;
  }
})();

export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    isDev && prettyTarget
      ? {
          target: prettyTarget,
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        }
      : undefined,
});
