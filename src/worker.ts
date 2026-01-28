import { rabbitmq } from "./infra/queue/rabbitmq.js";
import { logger } from "./config/logger.js";

const queue = "notes.created";

await rabbitmq.consume(queue, async (msg) => {
  const payload = JSON.parse(msg.content.toString());
  logger.info({ payload }, "Received note event");
});

logger.info(`Worker started. Listening on queue: ${queue}`);
