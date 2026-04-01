import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NameTypeEnum } from '../../common/enums/name-type.enum';
import { ScriptEnum } from '../../common/enums/script.enum';
import { EntityProfile } from '../../entity-profile/entities/entity-profile.entity';
import { getEncryptionTransformer } from '../../common/encryption/encryption.singleton';

const encryptionTransformer = getEncryptionTransformer();

@Entity('entity_names')
export class EntityName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  entityProfileId: string;

  @ManyToOne(() => EntityProfile, (entityProfile) => entityProfile.names, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entityProfileId' })
  entityProfile: EntityProfile;

  @Column({ type: 'text', transformer: encryptionTransformer })
  name: string;

  @Column({
    type: 'enum',
    enum: NameTypeEnum,
    default: NameTypeEnum.PRIMARY_NAME,
  })
  nameType: NameTypeEnum;

  @Column({
    type: 'enum',
    enum: ScriptEnum,
    nullable: true,
  })
  script?: ScriptEnum | null;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
