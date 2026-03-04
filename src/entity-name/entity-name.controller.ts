import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntityNameService } from './entity-name.service';
import { CreateEntityNameDto } from './dto/create-entity-name.dto';
import { UpdateEntityNameDto } from './dto/update-entity-name.dto';

@Controller('entity-name')
export class EntityNameController {
  constructor(private readonly entityNameService: EntityNameService) {}

  @Post()
  create(@Body() createEntityNameDto: CreateEntityNameDto) {
    return this.entityNameService.create(createEntityNameDto);
  }

  @Get()
  findAll() {
    return this.entityNameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entityNameService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntityNameDto: UpdateEntityNameDto) {
    return this.entityNameService.update(id, updateEntityNameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entityNameService.remove(id);
  }
}
