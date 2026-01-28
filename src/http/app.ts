import express from "express";
import { toNodeHandler } from "better-auth/node";
import { createRoutes } from "./routes.js";
import { requestId } from "./middleware/requestId.js";
import { errorHandler } from "./middleware/error.js";
import { requireSession } from "./middleware/requireSession.js";
import { NotesController } from "./controllers/notes.controller.js";
import { AuthController } from "./controllers/auth.controller.js";
import { NotesService } from "../app/services/notes.service.js";
import { InMemoryNoteRepository } from "../infra/repos/inMemory/noteRepository.js";
import { PostgresNoteRepository } from "../infra/repos/postgres/noteRepository.js";
import { NoteRepository } from "../domain/repositories/noteRepository.js";
import { NoopEventPublisher } from "../infra/events/noopEventPublisher.js";
import { RabbitMQEventPublisher } from "../infra/events/rabbitmqEventPublisher.js";
import { EventPublisher } from "../domain/events/eventPublisher.js";
import { auth } from "../auth/auth.js";
import { env } from "../config/env.js";

/**
 * Factory for creating the Express application instance.
 *
 * Attaches common middleware, routes, and error handling. A factory
 * function makes it easy to configure the app differently in tests.
 */
type AppDependencies = {
  notesController?: NotesController;
  notesService?: NotesService;
  notesRepository?: NoteRepository;
  notesPublisher?: EventPublisher;
  authController?: AuthController;
};

export function createApp(deps: AppDependencies = {}) {
  const notesRepository =
    deps.notesRepository ??
    (env.NOTES_REPOSITORY === "postgres"
      ? new PostgresNoteRepository()
      : new InMemoryNoteRepository());
  const notesPublisher =
    deps.notesPublisher ??
    (env.RABBITMQ_URL ? new RabbitMQEventPublisher() : new NoopEventPublisher());
  const notesService =
    deps.notesService ?? new NotesService(notesRepository, notesPublisher);
  const notesController = deps.notesController ?? new NotesController(notesService);
  const authController = deps.authController ?? new AuthController();
  const routes = createRoutes({ notesController, authController, requireSession });
  const app = express();
  app.use(requestId);
  app.all("/api/auth/*splat", toNodeHandler(auth));
  app.use(express.json());
  app.use("/", routes);
  app.use(errorHandler);
  return app;
}
