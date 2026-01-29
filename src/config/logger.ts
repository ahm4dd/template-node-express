import { createRequire } from "node:module";
import pino from "pino";
import { env } from "./env.js";

const isDev = env.NODE_ENV === "development";
const require = createRequire(import.meta.url); // Enable CommonJS resolution in ESM.

// Resolve pino-pretty only if it's installed (dev dependency).
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
  // Dev-only transport to pretty-print logs when pino-pretty is installed.
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
