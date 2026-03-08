import { DomainEvent } from './domain-event';

export class RequisitionApprovedEvent extends DomainEvent {
  requisitionNumber: string;
  approvedBy: string;
  approvalComment: string;

  getEventType(): string {
    return 'REQUISITION_APPROVED';
  }

  getApprovalDetails(): Record<string, any> {
    return {
      requisitionNumber: this.requisitionNumber,
      approvedBy: this.approvedBy,
      approvalComment: this.approvalComment,
    };
  }
}
