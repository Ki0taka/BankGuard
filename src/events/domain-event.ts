export abstract class DomainEvent {
  id: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  userId: string;
  ipAddress: string;
  occurredAt: Date;
  schemaVersion: number;

  getEventDetails(): Record<string, any> {
    return {};
  }

  abstract getEventType(): string;
}
