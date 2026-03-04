import { DomainEvent } from './domain-event';
import { EntityTypeEnum } from '../common/enums/entity-type.enum';

export class EntityCreatedEvent extends DomainEvent {
  entityType: EntityTypeEnum;
  groupId: number;
  requisitionId: string;

  getEventType(): string {
    return 'ENTITY_CREATED';
  }

  getCreationDetails(): Record<string, any> {
    return { entityType: this.entityType, groupId: this.groupId, requisitionId: this.requisitionId };
  }
}
