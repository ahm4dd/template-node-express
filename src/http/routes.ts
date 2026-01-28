import { Router } from "express";
import { NotesController } from "./controllers/notes.controller.js";

type RouteDependencies = {
  notesController: NotesController;
};

export function createRoutes({ notesController }: RouteDependencies) {
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
  router.get("/notes/:id", notesController.getOne);

  return router;
}
