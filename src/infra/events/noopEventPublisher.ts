import { EventPublisher, type DomainEvent } from "../../domain/events/eventPublisher.js";

export class NoopEventPublisher implements EventPublisher {
  async publish(_event: DomainEvent): Promise<void> {
    // Intentionally no-op for local dev or tests.
  }
}
