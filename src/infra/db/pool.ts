import { Pool } from "pg";
import { env } from "../../config/env.js";

export const pool = new Pool({
  // Single shared pool for the app process.
  connectionString: env.DATABASE_URL,
});
