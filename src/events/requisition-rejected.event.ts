import { DomainEvent } from './domain-event';

export class RequisitionRejectedEvent extends DomainEvent {
  requisitionNumber: string;
  rejectedBy: string;
  rejectionReason: string;

  getEventType(): string {
    return 'REQUISITION_REJECTED';
  }

  getRejectionDetails(): Record<string, any> {
    return { requisitionNumber: this.requisitionNumber, rejectedBy: this.rejectedBy, rejectionReason: this.rejectionReason };
  }
}
