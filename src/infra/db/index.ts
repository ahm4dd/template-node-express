import { drizzle } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import * as schema from "./schema.js";
import { pool } from "./pool.js";

export const db = drizzle({ client: pool, schema });
export type DbClient = typeof db;

export function createDb(client: Pool) {
  return drizzle({ client, schema });
}
