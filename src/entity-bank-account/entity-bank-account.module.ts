import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityBankAccountService } from './entity-bank-account.service';
import { EntityBankAccountController } from './entity-bank-account.controller';
import { EntityBankAccountRepository } from './entity-bank-account.repository';
import { EntityBankAccount } from './entities/entity-bank-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityBankAccount])],
  controllers: [EntityBankAccountController],
  providers: [EntityBankAccountService, EntityBankAccountRepository],
  exports: [EntityBankAccountService, EntityBankAccountRepository],
})
export class EntityBankAccountModule {}
