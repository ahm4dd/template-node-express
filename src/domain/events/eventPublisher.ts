export type DomainEvent = {
  type: string;
  payload: Record<string, unknown>;
};

// Abstraction for emitting domain events.
export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}
