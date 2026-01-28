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
- Example protected route: `GET /me` (returns session).
- Example protected notes route: `POST /notes/private` (requires session).
- The auth handler is mounted **before** `express.json()` per Better Auth docs.

Key files:
- `src/auth/auth.ts` – Better Auth setup
- `src/http/middleware/requireSession.ts` – session guard
- `src/http/controllers/auth.controller.ts` – `GET /me`

## Database (Postgres + Drizzle)

- Schema: `src/infra/db/schema.ts`
- Client: `src/infra/db/index.ts`
- Migrations: `drizzle/`
- Repository: `src/infra/repos/postgres/noteRepository.ts`

Switch note persistence via env:
```
NOTES_REPOSITORY=postgres   # or memory
```

## RabbitMQ (Optional)

- Publisher: `src/infra/events/rabbitmqEventPublisher.ts`
- Client: `src/infra/queue/rabbitmq.ts`
- Worker example: `src/worker.ts`

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
