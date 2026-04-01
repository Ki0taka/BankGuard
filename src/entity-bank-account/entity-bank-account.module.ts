import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityBankAccountService } from './entity-bank-account.service';
import { EntityBankAccountController } from './entity-bank-account.controller';
import { EntityBankAccountRepository } from './entity-bank-account.repository';
import { EntityBankAccount } from './entities/entity-bank-account.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([EntityBankAccount]), AuditLogModule],
  controllers: [EntityBankAccountController],
  providers: [EntityBankAccountService, EntityBankAccountRepository],
  exports: [EntityBankAccountService, EntityBankAccountRepository],
})
export class EntityBankAccountModule {}
