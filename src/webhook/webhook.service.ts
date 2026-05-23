import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as crypto from 'crypto';
import { WebhookTarget } from './entities/webhook-target.entity';
import { WebhookDelivery } from './entities/webhook-delivery.entity';
import { EnrichmentService } from './enrichment.service';
import { FormatService } from './format.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(WebhookTarget)
    private readonly targetRepository: Repository<WebhookTarget>,
    @InjectRepository(WebhookDelivery)
    private readonly deliveryRepository: Repository<WebhookDelivery>,
    private readonly enrichmentService: EnrichmentService,
    private readonly formatService: FormatService,
  ) {}

  async findAllTargets() {
    return this.targetRepository.find();
  }

  async findTargetById(id: string) {
    return this.targetRepository.findOne({ where: { id } });
  }

  async createTarget(data: any) {
    const target = this.targetRepository.create({
      ...data,
      secretKey: data.secretKey || crypto.randomBytes(32).toString('hex'),
    });
    return this.targetRepository.save(target);
  }

  async updateTarget(id: string, data: any) {
    await this.targetRepository.update(id, data);
    return this.findTargetById(id);
  }

  async deleteTarget(id: string) {
    return this.targetRepository.delete(id);
  }

  async dispatch(batchId: string, eventType: string) {
    const targets = await this.targetRepository.find({
      where: { isActive: true },
    });

    const matchingTargets = targets.filter(
      (t) =>
        t.eventTypes.includes(eventType) ||
        t.eventTypes.includes('*') ||
        eventType === 'MANUAL_TEST', // Allow manual tests to reach all active targets
    );

    if (matchingTargets.length === 0) {
      this.logger.debug(`No active targets for event: ${eventType}`);
      return;
    }

    // Prepare full enriched payload once for all targets (shared)
    const enrichedData = await this.enrichmentService.getFullBatch(batchId);

    for (const target of matchingTargets) {
      await this.sendToTarget(target, eventType, enrichedData);
    }
  }

  private async sendToTarget(
    target: WebhookTarget,
    eventType: string,
    sharedData: any,
  ) {
    const { batch, entries } = sharedData;

    // 1. Format the data based on target configuration
    let formattedPayload: {
      content: string | Buffer;
      contentType: string;
      extension: string;
    };

    switch (target.format?.toUpperCase()) {
      case 'XML':
        formattedPayload = this.formatService.toXML(batch, entries);
        break;
      case 'EXCEL':
        formattedPayload = this.formatService.toExcel(batch, entries);
        break;
      case 'HMT':
        formattedPayload = this.formatService.toHMT(batch, entries);
        break;
      case 'CUSTOM':
        formattedPayload = this.formatService.toCustom(
          batch,
          entries,
          target.mapping,
        );
        break;
      case 'JSON':
      default:
        formattedPayload = this.formatService.toJSON(batch, entries);
        break;
    }

    const delivery = this.deliveryRepository.create({
      targetId: target.id,
      eventType,
      payload: sharedData, // Link the internal full data for reference
      status: 'PENDING',
      attemptCount: 1,
    });

    const savedDelivery = await this.deliveryRepository.save(delivery);
    const timestamp = Date.now().toString();

    // 2. Security: HMAC-SHA256 signature
    // For binary payloads, we sign the raw buffer/content
    const signature = crypto
      .createHmac('sha256', target.secretKey)
      .update(formattedPayload.content)
      .update(`.${timestamp}`)
      .digest('hex');

    try {
      this.logger.log(
        `Dispatching webhook to: ${target.url} [Event: ${eventType}, Format: ${target.format}]`,
      );

      const response = await axios.post(target.url, formattedPayload.content, {
        headers: {
          'Content-Type': formattedPayload.contentType,
          'X-Blacklist-Event': eventType,
          'X-Blacklist-Signature': signature,
          'X-Blacklist-Timestamp': timestamp,
          'X-Blacklist-Filename': `distribution_${batch.id}.${formattedPayload.extension}`,
        },
        timeout: 10000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      savedDelivery.status = 'SUCCESS';
      savedDelivery.responseStatus = response.status;
      savedDelivery.responseBody = JSON.stringify(response.data).substring(
        0,
        5000,
      );
    } catch (error) {
      this.logger.error(
        `Webhook delivery failed for target ${target.name}: ${error.message}`,
      );
      savedDelivery.status = 'FAILED';
      savedDelivery.responseStatus = error.response?.status;
      savedDelivery.responseBody = JSON.stringify(
        error.response?.data || error.message,
      ).substring(0, 5000);
      savedDelivery.errorMessage = error.message;
    }

    await this.deliveryRepository.save(savedDelivery);
  }

  async getDeliveries(targetId?: string) {
    return this.deliveryRepository.find({
      where: targetId ? { targetId } : {},
      relations: ['target'],
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
