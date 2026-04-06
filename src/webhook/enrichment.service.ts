import { Injectable, Logger } from '@nestjs/common';
import { SanctionedEntityService } from '../sanctioned-entity/sanctioned-entity.service';

@Injectable()
export class EnrichmentService {
  private readonly logger = new Logger(EnrichmentService.name);

  constructor(
    private readonly sanctionedEntityService: SanctionedEntityService,
  ) {}

  async getFullBatch(sanctionedEntityId: string) {
    try {
      this.logger.log(`Enriching data for batch ID: ${sanctionedEntityId}`);
      
      // 1. Get batch metadata
      const batch = await this.sanctionedEntityService.findOne(sanctionedEntityId);
      
      // 2. Get all entries (already flattened by SanctionedEntityService)
      const entries = await this.sanctionedEntityService.getEntries(sanctionedEntityId);
      
      return {
        timestamp: new Date().toISOString(),
        batch: {
          id: batch.id,
          source: batch.source,
          blacklistId: batch.blacklistId,
          status: batch.status,
          date: batch.date,
          entriesCount: batch.entriesCount,
          createdAt: batch.createdAt,
        },
        entries: entries,
      };
    } catch (error) {
      this.logger.error(`Failed to enrich batch ${sanctionedEntityId}: ${error.message}`);
      throw error;
    }
  }
}
