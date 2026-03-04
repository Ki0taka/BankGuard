import { DomainEvent } from './domain-event';

export class EntityUpdatedEvent extends DomainEvent {
  fieldName: string;
  oldValue: string;
  newValue: string;

  getEventType(): string {
    return 'ENTITY_UPDATED';
  }

  getUpdateDetails(): Record<string, any> {
    return { fieldName: this.fieldName, oldValue: this.oldValue, newValue: this.newValue };
  }
}
