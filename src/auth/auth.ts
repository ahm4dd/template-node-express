import { betterAuth } from "better-auth";
import { bearer, jwt } from "better-auth/plugins";
import { pool } from "../infra/db/pool.js";
import { env } from "../config/env.js";
import { hashPassword, verifyPassword } from "./password.js";

// Better Auth configuration used by the HTTP layer.
export const auth = betterAuth({
  database: pool,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  session: {
    expiresIn: env.AUTH_SESSION_EXPIRES_IN,
    updateAge: env.AUTH_SESSION_UPDATE_AGE,
    freshAge: env.AUTH_SESSION_FRESH_AGE,
  },
  plugins: [
    bearer(),
    jwt({
      jwt: {
        issuer: env.BETTER_AUTH_URL,
        audience: env.BETTER_AUTH_URL,
        expirationTime: env.AUTH_JWT_EXPIRATION,
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
});
