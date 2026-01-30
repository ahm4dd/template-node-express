# Node Express Template

A complete-but-approachable backend starter for Express + TypeScript. It demonstrates clean architecture, dependency injection, real auth, database access, messaging, and testing—without getting lost in framework magic.

This README is a full guide for beginners and future you. It shows **what each part does**, **how to run it**, **how to build features**, and **how to grow it into production**.

---

## Table of Contents

- [What You Get](#what-you-get)
- [Quickstart (Local)](#quickstart-local)
- [Project Structure](#project-structure)
- [How the App Boots](#how-the-app-boots)
- [Environment Files (Multi-env)](#environment-files-multi-env)
- [Auth (Better Auth)](#auth-better-auth)
- [Database (Postgres + Drizzle)](#database-postgres--drizzle)
- [Migrations (Drizzle + Better Auth)](#migrations-drizzle--better-auth)
- [Messaging (RabbitMQ)](#messaging-rabbitmq)
- [Worker](#worker)
- [HTTP Layer (Controllers, Routes, Middleware)](#http-layer-controllers-routes-middleware)
- [Dependency Injection (DI)](#dependency-injection-di)
- [Testing](#testing)
- [Lint / Format / Typecheck](#lint--format--typecheck)
- [Docker](#docker)
- [Style Guide](#style-guide)
- [Build a Feature (Step-by-step)](#build-a-feature-step-by-step)
- [Troubleshooting](#troubleshooting)
- [Production Readiness](#production-readiness)

---

## What You Get

- **TypeScript-first**: strict settings + ESM-ready build.
- **Validated env**: typed, validated config via Zod (`src/config/env.ts`).
- **Structured logging**: Pino with pretty logs in development.
- **Real auth**: Better Auth with sessions + bearer + JWT (see details below).
- **Database**: Postgres + Drizzle ORM, migrations included.
- **Messaging**: RabbitMQ publisher + worker example.
- **DI example**: controllers/services wired in `createApp`.
- **Tests**: unit, integration (DB), and e2e (HTTP).
- **Docker**: production Dockerfile + local Compose.
- **Lint/format**: ESLint v9 + Prettier.

---

## Quickstart (Local)

1) Copy env template
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

4) Install dependencies
```
npm install
```

5) Generate migrations and migrate (Drizzle)
```
npm run db:generate
npm run db:migrate
```

6) Generate Better Auth tables
```
SKIP_ENV_VALIDATION=true npm run auth:generate
SKIP_ENV_VALIDATION=true npm run auth:migrate
```
Note: `DATABASE_URL` must be set so the CLI can connect. The skip flag only bypasses app runtime validation.

7) Start the dev server
```
npm run dev
```

---

## Full Usage Guide

See `USAGE_GUIDE.md` for a complete walkthrough with curl examples,
responses, and a full feature build guide.

---

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
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── health.routes.ts
│   │   │   └── notes.routes.ts
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

## How the App Boots

The app starts in `src/server.ts`:

1) Load env via `src/config/env.ts`
2) Create the Express app with `createApp()`
3) Attach middleware + routes
4) Start listening on `PORT`

Key entry points:
- **HTTP**: `src/http/app.ts`
- **Worker**: `src/worker.ts`

---

## Environment Files (Multi-env)

The app auto-loads env files in this order:

1) `.env`
2) `.env.{NODE_ENV}`
3) `.env.local` (overrides)
4) `.env.{NODE_ENV}.local` (overrides)

This lets you keep production secrets separate from local dev.

---

## Auth (Better Auth)

### How it works in this template

We use **Better Auth** with:
- **Cookie sessions** for browsers
- **Bearer tokens** for mobile/CLI
- **JWTs** for service-to-service calls

Auth endpoints are mounted under `/api/auth/*`:
- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `GET /api/auth/get-session`
- `POST /api/auth/sign-out`

We also provide a simple app endpoint:
- `GET /api/v1/me` → returns `req.session`

### Cookie sessions (browser)

- Sessions are stored in the database.
- Cookies are `httpOnly`, `secure` in production, and `SameSite=Lax` by default.
- Use this for any web frontend on the same domain.

### Bearer tokens (mobile/CLI)

- Better Auth returns `set-auth-token` in response headers.
- Store that token in your client, send it as:
  ```
  Authorization: Bearer <token>
  ```
- `requireSession` works with cookies or bearer tokens.

### JWTs (service-to-service)

- JWTs are short-lived and are meant for services, not browsers.
- Get a token using the Better Auth client or `GET /api/auth/token`.
- Validate via `/api/auth/jwks` if needed.

### Auth env config

```
AUTH_SESSION_EXPIRES_IN=604800      # seconds (7 days)
AUTH_SESSION_UPDATE_AGE=86400       # seconds (1 day)
AUTH_SESSION_FRESH_AGE=86400        # seconds (1 day)
AUTH_JWT_EXPIRATION=15m             # duration string
```

### Where are auth tables stored?

Better Auth uses the **Postgres `public` schema** by default. To see tables:
```
psql postgresql://app:app@localhost:5432/app
\dt
```

### Admin panel

Better Auth is backend-first. There is no official admin UI, but community tools exist. You can always query the database directly or build your own admin module.

---

## Database (Postgres + Drizzle)

- Schema: `src/infra/db/schema.ts`
- Client: `src/infra/db/index.ts`
- Migrations: `drizzle/`
- Repository: `src/infra/repos/postgres/noteRepository.ts`

Switch note persistence:
```
NOTES_REPOSITORY=postgres   # or memory
```

---

## Migrations (Drizzle + Better Auth)

### Drizzle

Generate migration files from schema changes:
```
npm run db:generate
```

Apply migrations:
```
npm run db:migrate
```

### Better Auth

Generate auth tables:
```
SKIP_ENV_VALIDATION=true npm run auth:generate
```

Apply auth migrations:
```
SKIP_ENV_VALIDATION=true npm run auth:migrate
```

---

## Messaging (RabbitMQ)

The template includes a minimal event publisher and a worker example.

- Publisher: `src/infra/events/rabbitmqEventPublisher.ts`
- Client: `src/infra/queue/rabbitmq.ts`
- Worker: `src/worker.ts`

If `RABBITMQ_URL` is not set, we fallback to a no-op publisher.

---

## Worker

The worker is a separate process that listens for events.

Build and run:
```
npm run build
npm run worker
```

The worker is intentionally small. It’s a teaching example for:
- how to connect to RabbitMQ
- how to process events
- how to log and shut down gracefully

---

## HTTP Layer (Controllers, Routes, Middleware)

### Controllers
Controllers call services and return responses. Example:
- `NotesController` validates input and calls `NotesService`

### Services
Services contain business logic. Example:
- `NotesService` handles validation, persistence, and publishing events

### Middleware
- `requestId` adds a request ID to every request
- `requireSession` ensures the user is authenticated
- `errorHandler` handles errors consistently

---

## Dependency Injection (DI)

`createApp` accepts dependencies so you can:
- swap repositories (memory vs postgres)
- swap publishers (rabbitmq vs noop)
- test controllers/services in isolation

This keeps your code clean and makes it easier to test.

---

## Testing

### Unit tests
```
npm run test:unit
```

### Integration tests (requires Docker)
```
npm run test:integration
```

### E2E tests (requires Docker)
```
npm run test:e2e
```

---

## Lint / Format / Typecheck

```
npm run lint
npm run format
npm run typecheck:tests
```

---

## Docker

Build/run the API + dependencies locally:
```
docker compose up --build
```

### Docker Compose 101 (quick explanation)

- `compose.yaml` defines the services you want to run together (API, Postgres, RabbitMQ).
- `db` uses a named volume so your data persists.
- `api` depends on `db` and `rabbitmq` so it starts after them.

---

## Style Guide

See `STYLE_GUIDE.md` for coding conventions used throughout this template.

---

## Build a Feature (Step-by-step)

Example: Add a **Tasks** feature.

1) **Domain**
   - Create `src/domain/entities/task.ts`
   - Define the `Task` type

2) **Repository interface**
   - Add `src/domain/repositories/taskRepository.ts`

3) **Infra implementation**
   - Add `src/infra/repos/postgres/taskRepository.ts`
   - Add `src/infra/repos/inMemory/taskRepository.ts`

4) **Database schema**
   - Update `src/infra/db/schema.ts`
   - Run:
     ```
     npm run db:generate
     npm run db:migrate
     ```

5) **Service**
   - Create `src/app/services/tasks.service.ts`

6) **Controller**
   - Create `src/http/controllers/tasks.controller.ts`

7) **Routes**
   - Create `src/http/routes/tasks.routes.ts`
   - Add it to `src/http/routes.ts`

8) **Tests**
   - Unit test service logic
   - Integration test the repository
   - E2E test the HTTP endpoints

That’s the full path from domain → infra → HTTP.

---

## Troubleshooting

### Postgres `exec format error`
If your Docker cache is corrupted or the platform is wrong, Postgres may crash.
Try:
```
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose up --build
```
Or override the image:
```
POSTGRES_IMAGE=postgres:18.1-bookworm docker compose up --build
```

### Better Auth migrations failing
Make sure `DATABASE_URL` is set, then run:
```
SKIP_ENV_VALIDATION=true npm run auth:migrate
```

---

## Production Readiness

See `PRODUCTION_GAPS.md` for everything missing before a real production launch.

---

This template is a starting point, not a framework. It gives you realistic defaults and clear examples so you can grow it safely as your app gets more complex.
