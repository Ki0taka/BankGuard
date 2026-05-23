import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { WebhookListener } from './webhook.listener';
import { EnrichmentService } from './enrichment.service';
import { FormatService } from './format.service';
import { WebhookTarget } from './entities/webhook-target.entity';
import { WebhookDelivery } from './entities/webhook-delivery.entity';
import { SanctionedEntityModule } from '../sanctioned-entity/sanctioned-entity.module';
import { SystemSettingModule } from '../system-setting/system-setting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebhookTarget, WebhookDelivery]),
    SanctionedEntityModule,
    SystemSettingModule,
  ],
  providers: [
    WebhookService,
    WebhookListener,
    EnrichmentService,
    FormatService,
  ],
  controllers: [WebhookController],
  exports: [WebhookService],
})
export class WebhookModule {}
