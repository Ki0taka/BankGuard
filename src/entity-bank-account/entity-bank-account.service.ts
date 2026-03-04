import { Injectable } from '@nestjs/common';
import { EntityBankAccountRepository } from './entity-bank-account.repository';
import { CreateEntityBankAccountDto } from './dto/create-entity-bank-account.dto';
import { UpdateEntityBankAccountDto } from './dto/update-entity-bank-account.dto';

@Injectable()
export class EntityBankAccountService {
  constructor(private readonly entityBankAccountRepository: EntityBankAccountRepository) {}

  create(createEntityBankAccountDto: CreateEntityBankAccountDto) {
    return 'This action adds a new entityBankAccount';
  }

  findAll() {
    return `This action returns all entityBankAccount`;
  }

  findOne(id: string) {
    return `This action returns a #entityBankAccount id`;
  }

  update(id: string, updateEntityBankAccountDto: UpdateEntityBankAccountDto) {
    return `This action updates a #entityBankAccount id`;
  }

  remove(id: string) {
    return `This action removes a #entityBankAccount id`;
  }
}
