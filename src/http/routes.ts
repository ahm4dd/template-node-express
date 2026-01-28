import { Router, type RequestHandler } from "express";
import { NotesController } from "./controllers/notes.controller.js";
import { AuthController } from "./controllers/auth.controller.js";

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

  // Health check for liveness
  router.get("/healthz", (_req, res) => {
    res.json({ ok: true });
  });

  // Readiness check for DB or other service availability. For now always true.
  router.get("/readyz", async (_req, res) => {
    res.json({ ok: true });
  });

  // Notes endpoints
  router.post("/notes", notesController.create);
  router.post("/notes/private", requireSession, notesController.createPrivate);
  router.get("/notes/:id", notesController.getOne);

  // Auth example: return current session if authenticated.
  router.get("/me", requireSession, authController.me);

  return router;
}
