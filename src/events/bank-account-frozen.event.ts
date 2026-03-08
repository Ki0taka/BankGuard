import { DomainEvent } from './domain-event';

export class BankAccountFrozenEvent extends DomainEvent {
  accountId: string;
  frozenBy: string;
  legalBasis: string;
  entityId: string;

  getEventType(): string {
    return 'BANK_ACCOUNT_FROZEN';
  }

  getFreezeDetails(): Record<string, any> {
    return {
      accountId: this.accountId,
      frozenBy: this.frozenBy,
      legalBasis: this.legalBasis,
      entityId: this.entityId,
    };
  }
}
