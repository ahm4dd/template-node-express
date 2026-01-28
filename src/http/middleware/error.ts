import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors.js";
import { logger } from "../../config/logger.js";

/**
 * Centralized error handling middleware.
 *
 * Converts known AppErrors into structured JSON responses with appropriate
 * HTTP status codes. Unexpected errors return a generic 500 without
 * leaking internals to the client. All errors are logged with the
 * request identifier for correlation.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const reqId = req.id;
  if (err instanceof AppError) {
    logger.error(`[${reqId}]`, err.code, err.message);
    return res
      .status(err.httpStatus)
      .json({ error: err.code, message: err.message, requestId: reqId });
  }
  logger.error(`[${reqId}]`, err);
  return res
    .status(500)
    .json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
      requestId: reqId,
    });
}
