import { Router, type RequestHandler } from "express";
import { AuthController } from "../controllers/auth.controller.js";

type AuthRouteDependencies = {
  authController: AuthController;
  requireSession: RequestHandler;
};

export function createAuthRoutes({
  authController,
  requireSession,
}: AuthRouteDependencies) {
  const router = Router();

  // Auth example: return current session if authenticated.
  router.get("/me", requireSession, authController.me.bind(authController));

  return router;
}
