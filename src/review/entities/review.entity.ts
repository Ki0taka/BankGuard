import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReviewDecisionEnum } from '../../common/enums/review-decision.enum';
import { SanctionedEntity } from '../../sanctioned-entity/entities/sanctioned-entity.entity';
import { User } from '../../user/entities/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sanctionedEntityId: string;

  @ManyToOne(
    () => SanctionedEntity,
    (sanctionedEntity) => sanctionedEntity.reviews,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'sanctionedEntityId' })
  sanctionedEntity: SanctionedEntity;

  @Column({ type: 'uuid' })
  reviewerId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reviewerId' })
  reviewer: User;

  @Column({
    type: 'enum',
    enum: ReviewDecisionEnum,
  })
  decision: ReviewDecisionEnum;

  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
