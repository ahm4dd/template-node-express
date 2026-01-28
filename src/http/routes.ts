import { Router } from "express";
import { notesController } from "./controllers/notes.controller.ts";

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

export default router;
