/**
 * Minimal logger abstraction.
 *
 * Real projects typically integrate a structured logger like pino or Winston.
 * This simple wrapper centralizes logging so you can swap
 * implementations later without changing call sites.
 */
export const logger = {
  info: (...args: unknown[]) => {
    console.log(new Date().toISOString(), "INFO", ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(new Date().toISOString(), "WARN", ...args);
  },
  error: (...args: unknown[]) => {
    console.error(new Date().toISOString(), "ERROR", ...args);
  },
};