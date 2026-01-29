import { EventPublisher, type DomainEvent } from "../../domain/events/eventPublisher.js";
import { rabbitmq } from "../queue/rabbitmq.js";

export class RabbitMQEventPublisher implements EventPublisher {
  async publish(event: DomainEvent): Promise<void> {
    // Publish to a queue named after the event type.
    await rabbitmq.publish(event.type, event.payload);
  }
}
