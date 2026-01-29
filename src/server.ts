import { createApp } from "./http/app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { pool } from "./infra/db/pool.js";
import { rabbitmq } from "./infra/queue/rabbitmq.js";

// Initialize the Express app
const app = createApp();

// Start listening on the configured port
const port = env.PORT;
const server = app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

async function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down");
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
  await rabbitmq.close();
  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
