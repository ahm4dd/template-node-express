import { createApp } from "./http/app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

// Initialize the Express app
const app = createApp();

// Start listening on the configured port
const port = env.PORT;
app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
