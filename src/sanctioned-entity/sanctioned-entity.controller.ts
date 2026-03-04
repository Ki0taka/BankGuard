import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SanctionedEntityService } from './sanctioned-entity.service';
import { CreateSanctionedEntityDto } from './dto/create-sanctioned-entity.dto';
import { UpdateSanctionedEntityDto } from './dto/update-sanctioned-entity.dto';

@Controller('sanctioned-entity')
export class SanctionedEntityController {
  constructor(private readonly sanctionedEntityService: SanctionedEntityService) {}

  @Post()
  create(@Body() createSanctionedEntityDto: CreateSanctionedEntityDto) {
    return this.sanctionedEntityService.create(createSanctionedEntityDto);
  }

  @Get()
  findAll() {
    return this.sanctionedEntityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sanctionedEntityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSanctionedEntityDto: UpdateSanctionedEntityDto) {
    return this.sanctionedEntityService.update(id, updateSanctionedEntityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sanctionedEntityService.remove(id);
  }
}
