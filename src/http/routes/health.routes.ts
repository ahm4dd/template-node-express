import { Router } from "express";

export function createHealthRoutes() {
  const router = Router();

  // Health check for liveness.
  router.get("/healthz", (_req, res) => {
    res.json({ ok: true });
  });

  // Readiness check for DB or other service availability. For now always true.
  router.get("/readyz", async (_req, res) => {
    res.json({ ok: true });
  });

  return router;
}
