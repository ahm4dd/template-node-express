import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

const loadEnvFile = (filename: string, override = false) => {
  const filePath = resolve(process.cwd(), filename);
  if (existsSync(filePath)) {
    config({ path: filePath, override });
  }
};

// Load base env first so NODE_ENV can be set from .env
loadEnvFile(".env");

const nodeEnv = process.env.NODE_ENV ?? "development";
loadEnvFile(`.env.${nodeEnv}`);
loadEnvFile(".env.local", true);
loadEnvFile(`.env.${nodeEnv}.local`, true);

/**
 * Validate and export environment variables.
 *
 * Parsing at startup prevents runtime surprises when env vars are missing
 * or of the wrong shape. Use this module instead of accessing
 * `process.env` directly in your application code.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  DATABASE_URL: z.url(),
  NOTES_REPOSITORY: z.enum(["memory", "postgres"]).default("postgres"),
  RABBITMQ_URL: z.url().optional(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

const skipValidation = process.env.SKIP_ENV_VALIDATION === "true";
const result = (skipValidation ? envSchema.partial() : envSchema).safeParse(process.env);

if (!result.success) {
  const tree = z.treeifyError(result.error);
  const fieldErrors = Object.fromEntries(
    Object.entries(tree.properties ?? {}).map(([key, value]) => [
      key,
      value.errors,
    ]),
  );
  console.error("❌ Invalid environment variables", fieldErrors);
  process.exit(1);
}

export const env: Env = result.data as Env;
