import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CreateWebhookTargetDto } from './dto/create-webhook-target.dto';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get('targets')
  async getTargets() {
    return this.webhookService.findAllTargets();
  }

  @Post('targets')
  async createTarget(@Body() dto: CreateWebhookTargetDto) {
    return this.webhookService.createTarget(dto);
  }

  @Get('targets/:id')
  async getTarget(@Param('id') id: string) {
    return this.webhookService.findTargetById(id);
  }

  @Put('targets/:id')
  async updateTarget(@Param('id') id: string, @Body() dto: any) {
    return this.webhookService.updateTarget(id, dto);
  }

  @Delete('targets/:id')
  async deleteTarget(@Param('id') id: string) {
    return this.webhookService.deleteTarget(id);
  }

  @Get('deliveries')
  async getDeliveries(@Query('targetId') targetId?: string) {
    return this.webhookService.getDeliveries(targetId);
  }

  // Manual trigger for a specific batch to a specific target
  @Post('test-delivery')
  async testDelivery(@Body() body: { batchId: string; targetId: string }) {
    const target = await this.webhookService.findTargetById(body.targetId);
    if (!target) throw new Error('Target not found');
    
    // We can use a special event type for manual tests
    return this.webhookService.dispatch(body.batchId, 'MANUAL_TEST');
  }
}
