import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

/**
 * Assigns a unique request identifier and exposes it on the request object and response headers.
 */
export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = randomUUID();
  req.id = id;
  res.setHeader("X-Request-ID", id);
  next();
}