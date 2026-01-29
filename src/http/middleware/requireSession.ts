import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../auth/auth.js";
import { UnauthorizedError } from "../../shared/errors.js";

export async function requireSession(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  // Read session from Better Auth using request headers.
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    // Bubble up to centralized error handler.
    return next(new UnauthorizedError("Authentication required"));
  }

  // Attach session for downstream handlers.
  req.session = session;
  return next();
}
