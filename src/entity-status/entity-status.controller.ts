import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntityStatusService } from './entity-status.service';
import { CreateEntityStatusDto } from './dto/create-entity-status.dto';
import { UpdateEntityStatusDto } from './dto/update-entity-status.dto';

@Controller('entity-status')
export class EntityStatusController {
  constructor(private readonly entityStatusService: EntityStatusService) {}

  @Post()
  create(@Body() createEntityStatusDto: CreateEntityStatusDto) {
    return this.entityStatusService.create(createEntityStatusDto);
  }

  @Get()
  findAll() {
    return this.entityStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entityStatusService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntityStatusDto: UpdateEntityStatusDto) {
    return this.entityStatusService.update(id, updateEntityStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entityStatusService.remove(id);
  }
}
