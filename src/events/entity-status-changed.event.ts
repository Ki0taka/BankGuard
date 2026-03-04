import { DomainEvent } from './domain-event';
import { StatusEnum } from '../common/enums/status.enum';
import { RiskEnum } from '../common/enums/risk.enum';

export class EntityStatusChangedEvent extends DomainEvent {
  previousStatus: StatusEnum;
  newStatus: StatusEnum;
  riskLevel: RiskEnum;
  changeReason: string;

  getEventType(): string {
    return 'ENTITY_STATUS_CHANGED';
  }

  getStatusDetails(): Record<string, any> {
    return { previousStatus: this.previousStatus, newStatus: this.newStatus, riskLevel: this.riskLevel, changeReason: this.changeReason };
  }
}
