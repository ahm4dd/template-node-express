import { connect, type Channel, type ChannelModel, type ConsumeMessage } from "amqplib";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

export type QueueHandler = (message: ConsumeMessage) => Promise<void> | void;

export class RabbitMQClient {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  private async getChannel(): Promise<Channel> {
    if (!env.RABBITMQ_URL) {
      throw new Error("RABBITMQ_URL is not configured");
    }
    if (!this.connection) {
      // Lazily create connection and channel on first use.
      this.connection = await connect(env.RABBITMQ_URL);
      this.connection.on("error", (err) => {
        logger.error({ err }, "RabbitMQ connection error");
      });
      this.connection.on("close", () => {
        logger.warn("RabbitMQ connection closed");
        this.connection = null;
        this.channel = null;
      });
    }
    const connection = this.connection;
    if (!connection) {
      throw new Error("RabbitMQ connection not available");
    }
    if (!this.channel) {
      this.channel = await connection.createChannel();
    }
    return this.channel;
  }

  async publish(queue: string, payload: Record<string, unknown>) {
    // Ensure queue exists and send a persistent message.
    const channel = await this.getChannel();
    await channel.assertQueue(queue, { durable: true });
    const body = Buffer.from(JSON.stringify(payload));
    channel.sendToQueue(queue, body, { persistent: true });
  }

  async consume(queue: string, handler: QueueHandler) {
    // Consume messages with explicit ack/nack.
    const channel = await this.getChannel();
    await channel.assertQueue(queue, { durable: true });
    await channel.prefetch(1);
    await channel.consume(queue, async (msg) => {
      if (!msg) {
        logger.warn("RabbitMQ consumer cancelled");
        return;
      }
      try {
        await handler(msg);
        channel.ack(msg);
      } catch (err) {
        logger.error({ err }, "RabbitMQ handler failed");
        channel.nack(msg, false, false);
      }
    });
  }

  async close() {
    await this.channel?.close();
    await this.connection?.close();
    this.channel = null;
    this.connection = null;
  }
}

export const rabbitmq = new RabbitMQClient();
