# Node Express Template

This repository is a **minimal but complete starter** for building backend APIs with Express and TypeScript. It follows a layered architecture with clear separation between the HTTP layer, application services, domain entities, and infrastructure. The template intentionally keeps the scope small so you can understand and extend it easily for real projects.

## Features

- **TypeScript first**: strict `tsconfig` and ESLint-ready structure.
- **Validated environment**: configuration loaded and validated via Zod (`src/config/env.ts`).
- **Request identifiers**: every incoming request gets a unique ID (`src/http/middleware/requestId.ts`).
- **Centralized logging**: simple logging abstraction (`src/config/logger.ts`) ready to swap for a structured logger.
- **Error handling**: unified error classes and middleware (`src/shared/errors.ts`, `src/http/middleware/error.ts`).
- **Dependency injection example**: controller and service wiring happens in the app factory to show clean composition.
- **In-memory persistence**: a default in-memory repository for rapid development and testing, with a clear interface to swap in a real database implementation later.
- **Health endpoints**: `GET /healthz` and `GET /readyz` for liveness and readiness checks.
- **Vitest tests**: example unit test demonstrating how to test services.

## Project Structure

```
template/
├── package.json        # package manifest and scripts
├── tsconfig.json       # TypeScript compiler options
├── README.md           # this file
├── src/
│   ├── server.ts      # server startup
│   ├── config/         # configuration and logger
│   │   ├── env.ts
│   │   └── logger.ts
│   ├── http/
│   │   ├── app.ts      # express app factory
│   │   ├── routes.ts   # route definitions
│   │   ├── middleware/
│   │   │   ├── error.ts
│   │   │   └── requestId.ts
│   │   └── controllers/
│   │       └── notes.controller.ts
│   ├── app/
│   │   ├── dto/        # Zod schemas for request/response
│   │   │   └── notes.ts
│   │   └── services/
│   │       └── notes.service.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   └── note.ts
│   │   └── repositories/
│   │       └── noteRepository.ts
│   ├── infra/
│   │   └── repos/
│   │       └── inMemory/
│   │           └── noteRepository.ts
│   └── shared/
│       └── errors.ts
├── tests/
│   └── unit/
│       └── notes.service.test.ts
└── vitest.config.ts
```

## Extending the Template

The in-memory repository is provided for demonstration and testing. In a real application you would:

- Add a database and ORM (e.g. Postgres with Drizzle ORM) under `src/infra/`.
- Implement the `NoteRepository` interface with your persistence layer.
- Add more domain entities and services under `src/domain/` and `src/app/`.
- Create additional controllers and DTOs for new endpoints in `src/http/`.
- Enhance logging with a structured logger like [pino](https://github.com/pinojs/pino).
- Introduce a message broker (RabbitMQ, NATS) and outbox pattern for asynchronous jobs.

This template is a starting point, not a framework. Feel free to evolve it to suit the needs of your projects.
