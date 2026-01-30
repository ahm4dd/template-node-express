# Template Usage Guide (Full Walkthrough)

This guide is the **full, step‑by‑step** way to use this template end‑to‑end. It includes **real curl examples** (with the **actual responses captured locally**) and a **full feature walkthrough** based on the existing Notes feature so you can copy the pattern with confidence.

---

## 0) Prerequisites

- Node.js 24+
- Docker (for Postgres + RabbitMQ)

---

## 1) Environment Setup

Copy and edit your environment file:

```
cp .env.example .env
```

Make sure `BETTER_AUTH_URL` includes the auth base path:

```
BETTER_AUTH_URL=http://localhost:3000/api/auth
```

Generate a secret:

```
openssl rand -base64 32
```

Paste it into `BETTER_AUTH_SECRET` in `.env`.

---

## 2) Start Infrastructure (DB + RabbitMQ)

```
docker compose up -d db rabbitmq
```

---

## 3) Install + Build

```
npm install
npm run build
```

---

## 4) Migrations

### Drizzle (App tables)

```
npm run db:generate
npm run db:migrate
```

### Better Auth (Auth tables + JWKS)

```
SKIP_ENV_VALIDATION=true npm run auth:generate
SKIP_ENV_VALIDATION=true npm run auth:migrate
```

---

## 5) Run the API

```
node dist/server.js
```

---

## 6) API Base Paths

- **App routes**: `http://localhost:3000/api/v1/*`
- **Auth routes**: `http://localhost:3000/api/auth/*`

---

## 7) Curl Guide (All Available Endpoints)

> These are real outputs captured from a working local run.

### 7.1 Health Checks

**Request**
```
curl -s http://localhost:3000/api/v1/healthz
```

**Response**
```json
{"ok":true}
```

**Request**
```
curl -s http://localhost:3000/api/v1/readyz
```

**Response**
```json
{"ok":true}
```

---

### 7.2 Auth: Sign Up (Email/Password)

> Better Auth email/password endpoints (see official docs).

**Request**
```
BASE_URL=http://localhost:3000
ORIGIN_HEADER="Origin: $BASE_URL"
COOKIE_JAR=/tmp/template-cookie.txt
EMAIL="user1769713995@example.com"
PASSWORD="Passw0rd!"

curl -s -c "$COOKIE_JAR" -X POST "$BASE_URL/api/auth/sign-up/email" \
  -H "$ORIGIN_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"New User\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"
```

**Response**
```json
{"token":"tXW7wgTrdipC5cRMEks0GaAEuOgLTcVa","user":{"name":"New User","email":"user1769713995@example.com","emailVerified":false,"image":null,"createdAt":"2026-01-29T19:13:16.083Z","updatedAt":"2026-01-29T19:13:16.083Z","id":"qAd6q8XaqlmqighBWhp9963UrIPiJdy6"}}
```

---

### 7.3 Auth: Sign In (Email/Password)

**Request**
```
curl -s -c "$COOKIE_JAR" -X POST "$BASE_URL/api/auth/sign-in/email" \
  -H "$ORIGIN_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"
```

**Response**
```json
{"redirect":false,"token":"KIQ8NsvTMRzXhOG8V78FqvA24oFWDvGq","user":{"name":"New User","email":"user1769713995@example.com","emailVerified":false,"image":null,"createdAt":"2026-01-29T19:13:16.083Z","updatedAt":"2026-01-29T19:13:16.083Z","id":"qAd6q8XaqlmqighBWhp9963UrIPiJdy6"}}
```

---

### 7.4 Auth: Get Session (Cookie)

**Request**
```
curl -s -b "$COOKIE_JAR" -H "$ORIGIN_HEADER" "$BASE_URL/api/auth/get-session"
```

**Response**
```json
{"session":{"expiresAt":"2026-02-05T19:13:16.171Z","token":"KIQ8NsvTMRzXhOG8V78FqvA24oFWDvGq","createdAt":"2026-01-29T19:13:16.171Z","updatedAt":"2026-01-29T19:13:16.171Z","ipAddress":"127.0.0.1","userAgent":"curl/8.18.0","userId":"qAd6q8XaqlmqighBWhp9963UrIPiJdy6","id":"wVi4ICyL79IDqRXySzrfr178Lub00wIF"},"user":{"name":"New User","email":"user1769713995@example.com","emailVerified":false,"image":null,"createdAt":"2026-01-29T19:13:16.083Z","updatedAt":"2026-01-29T19:13:16.083Z","id":"qAd6q8XaqlmqighBWhp9963UrIPiJdy6"}}
```

---

### 7.5 Auth: `/api/v1/me` (Requires Session)

**Request**
```
curl -s -b "$COOKIE_JAR" "$BASE_URL/api/v1/me"
```

**Response**
```json
{"session":{"expiresAt":"2026-02-05T19:13:16.171Z","token":"KIQ8NsvTMRzXhOG8V78FqvA24oFWDvGq","createdAt":"2026-01-29T19:13:16.171Z","updatedAt":"2026-01-29T19:13:16.171Z","ipAddress":"127.0.0.1","userAgent":"curl/8.18.0","userId":"qAd6q8XaqlmqighBWhp9963UrIPiJdy6","id":"wVi4ICyL79IDqRXySzrfr178Lub00wIF"},"user":{"name":"New User","email":"user1769713995@example.com","emailVerified":false,"image":null,"createdAt":"2026-01-29T19:13:16.083Z","updatedAt":"2026-01-29T19:13:16.083Z","id":"qAd6q8XaqlmqighBWhp9963UrIPiJdy6"}}
```

---

### 7.6 Notes: Create Public Note

**Request**
```
curl -s -X POST "$BASE_URL/api/v1/notes" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","body":"From curl"}'
```

**Response**
```json
{"id":"3a89404b-0144-40a2-b227-18dcc7234aa7","title":"Hello","body":"From curl","createdAt":"2026-01-29T19:13:16.231Z"}
```

---

### 7.7 Notes: Get Note by ID

**Request**
```
curl -s "$BASE_URL/api/v1/notes/3a89404b-0144-40a2-b227-18dcc7234aa7"
```

**Response**
```json
{"id":"3a89404b-0144-40a2-b227-18dcc7234aa7","title":"Hello","body":"From curl","createdAt":"2026-01-29T19:13:16.231Z"}
```

---

### 7.8 Notes: Create Private Note (Requires Session)

**Request**
```
curl -s -b "$COOKIE_JAR" -X POST "$BASE_URL/api/v1/notes/private" \
  -H "Content-Type: application/json" \
  -d '{"title":"Private","body":"Secret"}'
```

**Response**
```json
{"note":{"id":"6b6e26e2-9b36-49f4-a9f9-f5bca5fce503","title":"Private","body":"Secret","createdAt":"2026-01-29T19:13:16.340Z"},"user":{"name":"New User","email":"user1769713995@example.com","emailVerified":false,"image":null,"createdAt":"2026-01-29T19:13:16.083Z","updatedAt":"2026-01-29T19:13:16.083Z","id":"qAd6q8XaqlmqighBWhp9963UrIPiJdy6"}}
```

---

### 7.9 Auth: Bearer Token Usage

Better Auth’s bearer plugin lets non‑browser clients authenticate with:

```
Authorization: Bearer <token>
```

The `token` is returned by **sign‑in** above. Use it like this:

**Request**
```
BEARER_TOKEN="KIQ8NsvTMRzXhOG8V78FqvA24oFWDvGq"

curl -s -H "Authorization: Bearer $BEARER_TOKEN" "$BASE_URL/api/v1/me"
```

**Response**
```json
{"session":{"expiresAt":"2026-02-05T19:13:16.171Z","token":"KIQ8NsvTMRzXhOG8V78FqvA24oFWDvGq","createdAt":"2026-01-29T19:13:16.171Z","updatedAt":"2026-01-29T19:13:16.171Z","ipAddress":"127.0.0.1","userAgent":"curl/8.18.0","userId":"qAd6q8XaqlmqighBWhp9963UrIPiJdy6","id":"wVi4ICyL79IDqRXySzrfr178Lub00wIF"},"user":{"name":"New User","email":"user1769713995@example.com","emailVerified":false,"image":null,"createdAt":"2026-01-29T19:13:16.083Z","updatedAt":"2026-01-29T19:13:16.083Z","id":"qAd6q8XaqlmqighBWhp9963UrIPiJdy6"}}
```

---

### 7.10 Auth: JWT Token + JWKS

**Get a JWT**
```
curl -s -H "$ORIGIN_HEADER" \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  "$BASE_URL/api/auth/token"
```

**Response**
```json
{"token":"eyJhbGciOiJFZERTQSIsImtpZCI6ImhDaDdPUXpjMVZxNkg5ZnNvTnc3QkxZMDdZUWVod2hZIn0.eyJpYXQiOjE3Njk3MTM5OTYsIm5hbWUiOiJOZXcgVXNlciIsImVtYWlsIjoidXNlcjE3Njk3MTM5OTVAZXhhbXBsZS5jb20iLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwiaW1hZ2UiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjYtMDEtMjlUMTk6MTM6MTYuMDgzWiIsInVwZGF0ZWRBdCI6IjIwMjYtMDEtMjlUMTk6MTM6MTYuMDgzWiIsImlkIjoicUFkNnE4WGFxbG1xaWdoQldocDk5NjNVcklQaUpkeTYiLCJzdWIiOiJxQWQ2cThYYXFsbXFpZ2hCV2hwOTk2M1VySVBpSmR5NiIsImV4cCI6MTc2OTcxNDg5NiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9hdXRoIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9hdXRoIn0.EJecEXJWPz_C1d9DbGeMMwLt5PVvRVlrRcVJjDoE1LLCmJqh_5wKNXgN-s8aiJie9IqZpr3mjv9AL5pKR4bHAw"}
```

**Get JWKS (public keys)**
```
curl -s "$BASE_URL/api/auth/jwks"
```

**Response**
```json
{"keys":[{"alg":"EdDSA","crv":"Ed25519","x":"44DKUX1aaHXJ79SZt3Z75e4IkA6jNnAzccA7hcxJeZc","kty":"OKP","kid":"hCh7OQzc1Vq6H9fsoNw7BLY07YQehwhY"}]}
```

---

### 7.11 Auth: Sign Out

**Request**
```
curl -s -b "$COOKIE_JAR" -H "$ORIGIN_HEADER" -X POST "$BASE_URL/api/auth/sign-out"
```

**Response**
```json
{"success":true}
```

---

## 8) Full Feature Walkthrough (Production‑Style)

This section uses the **existing Notes feature** as the example. It already exists in the codebase, so you can open the files and see the real implementation.

### 8.1 Domain Entity

`src/domain/entities/note.ts`

```ts
export type Note = {
  id: string;
  title: string;
  body?: string;
  createdAt: Date;
};
```

### 8.2 DTO + Validation

`src/app/dto/notes.ts`

```ts
export const createNoteSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().max(2000).optional(),
});
```

### 8.3 Repository Interface

`src/domain/repositories/noteRepository.ts`

```ts
export interface NoteRepository {
  create(note: Note): Promise<Note>;
  get(id: string): Promise<Note | null>;
}
```

### 8.4 Repository Implementations

- In‑memory: `src/infra/repos/inMemory/noteRepository.ts`
- Postgres: `src/infra/repos/postgres/noteRepository.ts`

This lets you switch persistence with:

```
NOTES_REPOSITORY=postgres  # or memory
```

### 8.5 Service (Business Logic)

`src/app/services/notes.service.ts`

```ts
export class NotesService {
  async createNote(dto: CreateNoteDto) {
    const note = new NoteEntity(dto);
    const saved = await this.notesRepository.create(note);
    await this.eventPublisher.publish("note.created", saved);
    return saved;
  }
}
```

### 8.6 Controller (HTTP)

`src/http/controllers/notes.controller.ts`

```ts
async create(req: Request, res: Response) {
  const parsed = createNoteSchema.safeParse(req.body);
  if (!parsed.success) throw new ValidationError(...);
  const note = await this.notesService.createNote(parsed.data);
  return res.status(201).json(note);
}
```

### 8.7 Routes

`src/http/routes/notes.routes.ts`

```ts
router.post("/notes", notesController.create.bind(notesController));
router.post("/notes/private", requireSession, notesController.createPrivate.bind(notesController));
router.get("/notes/:id", notesController.getOne.bind(notesController));
```

Mounted at:

```
/api/v1/notes
/api/v1/notes/private
/api/v1/notes/:id
```

### 8.8 Tests

- Unit: `tests/unit/notes.service.test.ts`
- Integration: `tests/integration/notes.repository.test.ts`
- E2E: `tests/e2e/notes.e2e.test.ts`

Run them:

```
npm run test:unit
npm run test:integration
npm run test:e2e
```

### 8.9 Production‑Ready Enhancements (Add When Needed)

- Rate limit POST routes
- Add request validation to all routes
- Add RBAC / scopes if needed
- Add auditing + metrics
- Add retries + dead‑letter queue for events

See `PRODUCTION_GAPS.md` for the full checklist.

---

## 9) How to Build Your Own Feature (Checklist)

When you add a new feature (Tasks, Webhooks, Invoices):

1) **Domain entity** in `src/domain/entities/`
2) **DTO + validation** in `src/app/dto/`
3) **Repository interface** in `src/domain/repositories/`
4) **Repository implementations** in `src/infra/repos/`
5) **Service** in `src/app/services/`
6) **Controller** in `src/http/controllers/`
7) **Routes** in `src/http/routes/`
8) **Migrations** in `src/infra/db/schema.ts` + Drizzle migration
9) **Tests** at unit + integration + e2e levels

That’s the full architecture flow used in this template.

---

## 10) Troubleshooting

- **Auth 403 Missing Origin**: include `Origin: http://localhost:3000` for cookie‑based auth requests.
- **JWT / JWKS 404**: ensure `BETTER_AUTH_URL` includes `/api/auth` and that the server was rebuilt.
- **DB errors**: confirm `DATABASE_URL` and that `docker compose up -d db` is running.

---

## 11) Production Readiness

This template is intentionally small. Before production:

- Use `PRODUCTION_GAPS.md`
- Add CI/CD
- Add a secrets manager
- Add monitoring + alerting
- Add rate limits + security headers

---

If you want, I can add a second guide for **webhook delivery systems** specifically (retry strategy, idempotency keys, signing, and queue semantics).
