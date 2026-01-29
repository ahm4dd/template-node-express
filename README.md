# Node Express Template

A complete-but-approachable backend starter for Express + TypeScript. It demonstrates clean architecture, dependency injection, real auth, database access, messaging, and testing—without getting lost in framework magic.

## What You Get

- **TypeScript-first**: strict settings + ESM-ready build.
- **Validated env**: typed, validated config via Zod (`src/config/env.ts`).
- **Structured logging**: Pino with pretty logs in development.
- **Real auth**: Better Auth with sessions and email/password.
- **Database**: Postgres + Drizzle ORM, migrations included.
- **Messaging**: RabbitMQ publisher + worker example.
- **DI example**: controllers/services wired in `createApp`.
- **Tests**: unit, integration (DB), and e2e (HTTP).
- **Docker**: production Dockerfile + local Compose.
- **Lint/format**: ESLint v9 + Prettier.

## Quickstart (Local)

1) Create your env file
```
cp .env.example .env
```

2) Generate a secret for Better Auth
```
openssl rand -base64 32
```
Paste it into `BETTER_AUTH_SECRET` in `.env`.

3) Start Postgres + RabbitMQ
```
docker compose up -d db rabbitmq
```

4) Install deps
```
npm install
```

5) Generate migrations and migrate
```
npm run db:generate
npm run db:migrate
```

6) Generate Better Auth tables
```
SKIP_ENV_VALIDATION=true npm run auth:generate
SKIP_ENV_VALIDATION=true npm run auth:migrate
```
Note: `DATABASE_URL` must still be set for the CLI to connect. The skip flag only bypasses app runtime validation.

7) Start the dev server
```
npm run dev
```

## Auth (Better Auth)

- Auth endpoints are mounted under `/api/auth/*`.
- Example protected route: `GET /api/v1/me` (returns session).
- Example protected notes route: `POST /api/v1/notes/private` (requires session).
- The auth handler is mounted **before** `express.json()` per Better Auth docs.

Key files:
- `src/auth/auth.ts` – Better Auth setup
- `src/http/middleware/requireSession.ts` – session guard
- `src/http/controllers/auth.controller.ts` – `GET /api/v1/me`

### How sessions work (in this template)

- Better Auth stores **users, sessions, accounts, and verification records** in your database. The core tables include `user`, `session`, and `account`.
- Sessions are stored in the DB and **session cookies** are sent to the browser. Cookies are signed with `BETTER_AUTH_SECRET`, are `httpOnly`, and are `secure` in production, with `SameSite=Lax` by default.
- We use cookie-based sessions; the `/api/v1/me` endpoint shows how to fetch the current session.

### Where are the auth tables?

By default, Better Auth uses the **PostgreSQL `public` schema**. You can check with:
```
psql postgresql://app:app@localhost:5432/app
SHOW search_path;
\dt
```

If you want auth tables under a separate schema (e.g. `auth`), you can configure `search_path` in the DB connection.

### Admin panel / dashboard

If you want a dashboard to manage users and sessions, an unofficial community‑built option is Better Auth Console (self‑hosted).

Another option is the Better Auth Kit database explorer CLI for visualizing tables.

### Better Auth client (optional)

If you have a frontend, Better Auth provides a client library (vanilla + framework adapters).

Vanilla client:
```
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});
```

React client:
```
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});
```

If your frontend is on the same domain and uses the default `/api/auth` path, you can omit `baseURL`.

### What auth features are missing?

This template **only enables email/password** auth. You may want to add:
- Email verification
- Password reset flows
- OAuth providers (Google/GitHub)
- MFA / 2FA plugins

These are supported by Better Auth, but intentionally not enabled here so you can add them when needed.

### Password hashing (Argon2)

This template configures Argon2id for email/password via Better Auth's
custom password hasher hooks using the `argon2` package. See
`src/auth/password.ts`.

### Mobile / non-browser clients

Cookie-based sessions are great for browsers. For native apps or services that
can't or shouldn't use cookies, Better Auth provides bearer/JWT options so
clients can send an `Authorization: Bearer <token>` header instead. See the
Better Auth bearer/JWT plugin docs for guidance.

## Style Guide

See `STYLE_GUIDE.md` for coding conventions used throughout this template.

## Database (Postgres + Drizzle)

- Schema: `src/infra/db/schema.ts`
- Client: `src/infra/db/index.ts`
- Migrations: `drizzle/`
- Repository: `src/infra/repos/postgres/noteRepository.ts`

Note: if your Docker cache is corrupted, newer images can fail with `exec format error`.
This template uses `postgres:18.1-alpine3.23`. You can override it via:
```
POSTGRES_IMAGE=postgres:18.1-bookworm docker compose up --build
```
If it still fails, purge Docker data and re-pull the image.

Switch note persistence via env:
```
NOTES_REPOSITORY=postgres   # or memory
```

## RabbitMQ (Optional)

- Publisher: `src/infra/events/rabbitmqEventPublisher.ts`
- Client: `src/infra/queue/rabbitmq.ts`
- Worker example: `src/worker.ts`
 
Note: the RabbitMQ management metrics collector is deprecated in recent versions.
This template disables it to avoid relying on deprecated behavior. If you need
the management UI charts, remove the setting in `rabbitmq.conf` and accept the
deprecation warning, or rely on Prometheus metrics instead.

### Docker platform note (Apple Silicon / ARM)

By default, Docker pulls images for your machine's architecture. If you see `exec format error` when starting containers, force the platform for that run:
```
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose up --build
```

On Apple Silicon, use `linux/arm64` instead.

Build + run the worker:
```
npm run build
npm run worker
```

If `RABBITMQ_URL` is not set, the app uses a no-op publisher.

## Testing

- Unit tests:
```
npm run test:unit
```

- Integration tests (requires Docker):
```
npm run test:integration
```

- E2E tests (requires Docker):
```
npm run test:e2e
```

## Lint / Format

```
npm run lint
npm run format
```

Type-check tests and configs:
```
npm run typecheck:tests
```

## Docker

Build/run the API + dependencies locally:
```
docker compose up --build
```

### Docker Compose 101 (quick explanation)

- `compose.yaml` defines the services you want to run together (API, Postgres, RabbitMQ).
- `db` uses a named volume (`db-data`) so your data persists across restarts.
- `api` depends on `db` and `rabbitmq` so it starts after those containers.
- Use `docker compose down -v` if you want a clean reset (drops the database volume).

## Multi‑env support

The app automatically loads `.env` files in this order:

1) `.env`
2) `.env.{NODE_ENV}`
3) `.env.local` (overrides)
4) `.env.{NODE_ENV}.local` (overrides)

This lets you keep base defaults in `.env`, environment‑specific values in `.env.production`, and local overrides in `.env.local`.

## Production readiness

See `PRODUCTION_GAPS.md` for everything that is **still missing** before a real production release.

## Project Structure

```
template/
├── compose.yaml
├── Dockerfile
├── drizzle/                 # SQL migrations
├── eslint.config.js
├── package.json
├── tsconfig.json
├── src/
│   ├── server.ts            # server startup
│   ├── worker.ts            # RabbitMQ worker example
│   ├── auth/
│   │   └── auth.ts
│   ├── config/
│   │   ├── env.ts
│   │   └── logger.ts
│   ├── http/
│   │   ├── app.ts
│   │   ├── routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── notes.controller.ts
│   │   └── middleware/
│   │       ├── error.ts
│   │       ├── requestId.ts
│   │       └── requireSession.ts
│   ├── app/
│   │   ├── dto/
│   │   │   └── notes.ts
│   │   └── services/
│   │       └── notes.service.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   └── note.ts
│   │   ├── events/
│   │   │   └── eventPublisher.ts
│   │   └── repositories/
│   │       └── noteRepository.ts
│   ├── infra/
│   │   ├── db/
│   │   │   ├── index.ts
│   │   │   ├── pool.ts
│   │   │   └── schema.ts
│   │   ├── events/
│   │   │   ├── noopEventPublisher.ts
│   │   │   └── rabbitmqEventPublisher.ts
│   │   ├── queue/
│   │   │   └── rabbitmq.ts
│   │   └── repos/
│   │       ├── inMemory/
│   │       │   └── noteRepository.ts
│   │       └── postgres/
│   │           └── noteRepository.ts
│   └── shared/
│       └── errors.ts
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

This template is a starting point, not a framework. It gives you realistic defaults and clear examples so you can grow it safely as your app gets more complex.
