import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntityBankAccountService } from './entity-bank-account.service';
import { CreateEntityBankAccountDto } from './dto/create-entity-bank-account.dto';
import { UpdateEntityBankAccountDto } from './dto/update-entity-bank-account.dto';

@Controller('entity-bank-account')
export class EntityBankAccountController {
  constructor(private readonly entityBankAccountService: EntityBankAccountService) {}

  @Post()
  create(@Body() createEntityBankAccountDto: CreateEntityBankAccountDto) {
    return this.entityBankAccountService.create(createEntityBankAccountDto);
  }

  @Get()
  findAll() {
    return this.entityBankAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entityBankAccountService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntityBankAccountDto: UpdateEntityBankAccountDto) {
    return this.entityBankAccountService.update(id, updateEntityBankAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entityBankAccountService.remove(id);
  }
}
