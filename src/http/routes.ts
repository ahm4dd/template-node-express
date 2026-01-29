import { Router, type RequestHandler } from "express";
import { NotesController } from "./controllers/notes.controller.js";
import { AuthController } from "./controllers/auth.controller.js";
import { createHealthRoutes } from "./routes/health.routes.js";
import { createNotesRoutes } from "./routes/notes.routes.js";
import { createAuthRoutes } from "./routes/auth.routes.js";

type RouteDependencies = {
  notesController: NotesController;
  authController: AuthController;
  requireSession: RequestHandler;
};

export function createRoutes({
  notesController,
  authController,
  requireSession,
}: RouteDependencies) {
  const router = Router();

  router.use(createHealthRoutes());
  router.use(createNotesRoutes({ notesController, requireSession }));
  router.use(createAuthRoutes({ authController, requireSession }));

  return router;
}
