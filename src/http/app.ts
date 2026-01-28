import express from "express";
import { createRoutes } from "./routes.js";
import { requestId } from "./middleware/requestId.js";
import { errorHandler } from "./middleware/error.js";
import { NotesController } from "./controllers/notes.controller.js";
import { NotesService } from "../app/services/notes.service.js";
import { InMemoryNoteRepository } from "../infra/repos/inMemory/noteRepository.js";
import { NoteRepository } from "../domain/repositories/noteRepository.js";

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
};

export function createApp(deps: AppDependencies = {}) {
  const notesController =
    deps.notesController ??
    new NotesController(
      deps.notesService ??
        new NotesService(deps.notesRepository ?? new InMemoryNoteRepository()),
    );
  const routes = createRoutes({ notesController });
  const app = express();
  app.use(express.json());
  app.use(requestId);
  app.use("/", routes);
  app.use(errorHandler);
  return app;
}
