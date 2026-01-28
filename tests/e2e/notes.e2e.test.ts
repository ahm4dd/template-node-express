import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Server } from "http";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import request from "supertest";
import { createDb } from "../../src/infra/db/index.js";
import { PostgresNoteRepository } from "../../src/infra/repos/postgres/noteRepository.js";
import { NoopEventPublisher } from "../../src/infra/events/noopEventPublisher.js";
import { createApp } from "../../src/http/app.js";

const runE2E = process.env.RUN_E2E_TESTS === "true";
const describeE2E = runE2E ? describe : describe.skip;

describeE2E("Notes API (e2e)", () => {
  let container: StartedPostgreSqlContainer;
  let pool: Pool;
  let server: Server;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:16")
      .withDatabase("app")
      .withUsername("app")
      .withPassword("app")
      .start();
    pool = new Pool({ connectionString: container.getConnectionUri() });
    const db = createDb(pool);
    await migrate(db, { migrationsFolder: "drizzle" });

    const repo = new PostgresNoteRepository(db);
    const app = createApp({
      notesRepository: repo,
      notesPublisher: new NoopEventPublisher(),
    });
    server = app.listen(0);
  });

  afterAll(async () => {
    await pool.end();
    await container.stop();
    await new Promise((resolve) => server.close(resolve));
  });

  it("creates and fetches a note over HTTP", async () => {
    const createRes = await request(server)
      .post("/notes")
      .send({ title: "hello", body: "world" })
      .expect(201);

    const noteId = createRes.body.id;

    const getRes = await request(server).get(`/notes/${noteId}`).expect(200);
    expect(getRes.body.id).toBe(noteId);
    expect(getRes.body.title).toBe("hello");
  });
});
