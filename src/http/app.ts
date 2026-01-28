import express from "express";
import routes from "./routes.ts";
import { requestId } from "./middleware/requestId.ts";
import { errorHandler } from "./middleware/error.ts";

/**
 * Factory for creating the Express application instance.
 *
 * Attaches common middleware, routes, and error handling. A factory
 * function makes it easy to configure the app differently in tests.
 */
export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(requestId);
  app.use("/", routes);
  app.use(errorHandler);
  return app;
}
