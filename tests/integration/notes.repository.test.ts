import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDb } from "../../src/infra/db/index.js";
import { PostgresNoteRepository } from "../../src/infra/repos/postgres/noteRepository.js";

const runIntegration = process.env.RUN_INTEGRATION_TESTS === "true";
const describeIntegration = runIntegration ? describe : describe.skip;

describeIntegration("PostgresNoteRepository", () => {
  let container: StartedPostgreSqlContainer;
  let pool: Pool;

  beforeAll(async () => {
    const image = process.env.POSTGRES_TEST_IMAGE ?? "postgres:18.1-alpine3.23";
    container = await new PostgreSqlContainer(image)
      .withDatabase("app")
      .withUsername("app")
      .withPassword("app")
      .start();
    pool = new Pool({ connectionString: container.getConnectionUri() });
    const db = createDb(pool);
    await migrate(db, { migrationsFolder: "drizzle" });
  });

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  it("persists and fetches notes", async () => {
    const db = createDb(pool);
    const repo = new PostgresNoteRepository(db);
    const created = await repo.create({ title: "hello", body: "world" });
    const fetched = await repo.findById(created.id);
    expect(fetched).toEqual(created);
  });
});
