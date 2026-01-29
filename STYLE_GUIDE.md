# Style Guide (Template Conventions)

This template favors clarity and consistency over cleverness. Keep changes small,
predictable, and easy for new devs to follow.

## General
- Prefer small, single-purpose modules.
- Keep functions short and linear; extract helpers when logic grows.
- Use explicit names over short names.
- Avoid heavy comments; add only when intent isn’t obvious from types.

## TypeScript
- Use `strict` typing; avoid `any`.
- Prefer `type` for object shapes and `interface` for public contracts.
- Optional fields imply `undefined` by default.

## Null vs Undefined
- `undefined` = omitted / not provided.
- `null` = explicitly empty value (e.g., not found, no session).
- Normalize DB `NULL` to `undefined` in the domain model unless a field is
  explicitly nullable in the domain.

## Layering
- **Controllers**: HTTP I/O only (parse, validate, call service, respond).
- **Services**: business logic, orchestration, and domain rules.
- **Repositories**: persistence only.
- **Publishers**: emit domain events, no business logic.
- **Infra**: external systems (DB, queue, auth adapters).

## Routing
- Use **feature routers** per domain area (e.g., `notes.routes.ts`, `auth.routes.ts`).
- Mount them in a single composition point (e.g., `src/http/routes.ts`).
- Keep route handlers thin and delegate to controllers.

## Errors
- Throw `AppError` subclasses for expected failures.
- Central error handler maps them to JSON responses.
- Log unexpected errors with request id.

## Logging
- Log structured JSON in prod.
- Use pretty logs only in dev (optional dependency).
- Include `requestId` in error logs where possible.

## Testing
- Unit: pure functions/services with fakes.
- Integration: real DB + repositories.
- E2E: app + HTTP + real DB.

## Comments
- Prefer short inline comments near non-obvious behavior.
- Avoid JSDoc unless public API needs it.

