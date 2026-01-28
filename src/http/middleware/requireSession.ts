import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../auth/auth.js";
import { UnauthorizedError } from "../../shared/errors.js";

export async function requireSession(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return next(new UnauthorizedError("Authentication required"));
  }

  req.session = session;
  return next();
}
