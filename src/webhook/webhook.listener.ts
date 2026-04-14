import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WebhookService } from './webhook.service';
import { SystemSettingService } from '../system-setting/system-setting.service';
import { SanctionedEntityStatusChangedEvent } from '../events/sanctioned-entity-status-changed.event';
import { BlacklistStatusEnum } from '../common/enums/blacklist-status.enum';

@Injectable()
export class WebhookListener {
  private readonly logger = new Logger(WebhookListener.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly systemSettingService: SystemSettingService,
  ) {}

  @OnEvent('SANCTIONED_ENTITY_STATUS_CHANGED')
  async handleStatusChangedEvent(event: SanctionedEntityStatusChangedEvent) {
    this.logger.debug(`Webhook listener caught event for batch ${event.aggregateId}. New Status: ${event.newStatus}`);
    
    // Check if automatic distribution is enabled
    const isAutoEnabled = await this.systemSettingService.getAsBoolean('AUTO_DISTRIBUTION_ENABLED');
    if (!isAutoEnabled) {
      this.logger.log(`Skipping automatic distribution for batch ${event.aggregateId} because it is disabled.`);
      return;
    }

    // We only trigger webhooks when a batch becomes VALID
    if (event.newStatus === BlacklistStatusEnum.VALID) {
      this.logger.log(`Batch ${event.aggregateId} is now VALID. Triggering distribution to webhooks...`);
      await this.webhookService.dispatch(event.aggregateId, 'BATCH_VALIDATED');
    }
  }
}
