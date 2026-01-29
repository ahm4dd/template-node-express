import { drizzle } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import * as schema from "./schema.js";
import { pool } from "./pool.js";

// Default DB client for the app runtime.
export const db = drizzle({ client: pool, schema });
export type DbClient = typeof db;

// Helper for tests to supply their own Pool.
export function createDb(client: Pool) {
  return drizzle({ client, schema });
}
