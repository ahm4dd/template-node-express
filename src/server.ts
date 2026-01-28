import { createApp } from "./http/app.ts";
import { env } from "./config/env.ts";
import { logger } from "./config/logger.ts";

// Initialize the Express app
const app = createApp();

// Start listening on the configured port
const port = env.PORT;
app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
