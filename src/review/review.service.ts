import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { SanctionedEntityService } from '../sanctioned-entity/sanctioned-entity.service';
import { ReviewDecisionEnum } from '../common/enums/review-decision.enum';
import { BlacklistStatusEnum } from '../common/enums/blacklist-status.enum';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditActionEnum } from '../common/enums/audit-action.enum';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly sanctionedEntityService: SanctionedEntityService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const sanctionedEntity = await this.sanctionedEntityService.findOne(
      createReviewDto.sanctionedEntityId,
    );

    const review = this.reviewRepository.create(createReviewDto);
    const saved = await this.reviewRepository.save(review);

    await this.auditLogService.log({
      action: AuditActionEnum.REVIEW_CREATED,
      entityType: 'Review',
      entityId: saved.id,
      metadata: {
        sanctionedEntityId: createReviewDto.sanctionedEntityId,
        decision: createReviewDto.decision,
        reviewerId: createReviewDto.reviewerId,
      },
    });

    if (
      createReviewDto.decision === ReviewDecisionEnum.APPROVED &&
      sanctionedEntity.status !== BlacklistStatusEnum.ACTIVE
    ) {
      await this.sanctionedEntityService.update(sanctionedEntity.id, {
        status: BlacklistStatusEnum.ACTIVE,
      });
    }

    if (
      createReviewDto.decision === ReviewDecisionEnum.REJECTED &&
      sanctionedEntity.status !== BlacklistStatusEnum.REMOVED
    ) {
      await this.sanctionedEntityService.update(sanctionedEntity.id, {
        status: BlacklistStatusEnum.REMOVED,
      });
    }

    return saved;
  }

  findAll() {
    return this.reviewRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewRepository.preload({
      id,
      ...updateReviewDto,
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return this.reviewRepository.save(review);
  }

  async remove(id: string) {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
    return { deleted: true };
  }
}
