import { betterAuth } from "better-auth";
import { pool } from "../infra/db/pool.js";
import { env } from "../config/env.js";
import { hashPassword, verifyPassword } from "./password.js";

// Better Auth configuration used by the HTTP layer.
export const auth = betterAuth({
  database: pool,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
});
