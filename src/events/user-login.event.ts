import { DomainEvent } from './domain-event';

export class UserLoginEvent extends DomainEvent {
  loginSuccess: boolean;
  failureReason: string;
  attemptCount: number;

  getEventType(): string {
    return 'USER_LOGIN';
  }

  getLoginDetails(): Record<string, any> {
    return {
      loginSuccess: this.loginSuccess,
      failureReason: this.failureReason,
      attemptCount: this.attemptCount,
    };
  }
}
