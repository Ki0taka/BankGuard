import { DomainEvent } from './domain-event';
import { BlacklistStatusEnum } from '../common/enums/blacklist-status.enum';

export class SanctionedEntityStatusChangedEvent extends DomainEvent {
  previousStatus: BlacklistStatusEnum;
  newStatus: BlacklistStatusEnum;

  getEventType(): string {
    return 'SANCTIONED_ENTITY_STATUS_CHANGED';
  }

  getDetails(): Record<string, any> {
    return {
      batchId: this.aggregateId,
      previousStatus: this.previousStatus,
      newStatus: this.newStatus,
    };
  }
}
