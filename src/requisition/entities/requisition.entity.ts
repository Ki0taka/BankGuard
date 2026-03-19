import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OperationEnum } from '../../common/enums/operation.enum';
import { WorkflowStatusEnum } from '../../common/enums/workflow-status.enum';
import { SanctionedEntity } from '../../sanctioned-entity/entities/sanctioned-entity.entity';
import { User } from '../../user/entities/user.entity';

@Entity('requisitions')
export class Requisition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sanctionedEntityId: string;

  @ManyToOne(() => SanctionedEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sanctionedEntityId' })
  sanctionedEntity: SanctionedEntity;

  @Column({ type: 'uuid', nullable: true })
  requestedById?: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'requestedById' })
  requestedBy?: User | null;

  @Column({
    type: 'enum',
    enum: OperationEnum,
  })
  operation: OperationEnum;

  @Column({
    type: 'enum',
    enum: WorkflowStatusEnum,
    default: WorkflowStatusEnum.PENDING,
  })
  status: WorkflowStatusEnum;

  @Column({ type: 'text', nullable: true })
  reason?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
