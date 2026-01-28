import { z } from "zod";

/**
 * Validate and export environment variables.
 *
 * Parsing at startup prevents runtime surprises when env vars are missing
 * or of the wrong shape. Use this module instead of accessing
 * `process.env` directly in your application code.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = parseInt(val || "3000", 10);
      return isNaN(parsed) ? 3000 : parsed;
    }),
});

export type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
  // eslint-disable-next-line no-console
  console.error("❌ Invalid environment variables", result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env: Env = result.data;