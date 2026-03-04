import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntityProfileService } from './entity-profile.service';
import { CreateEntityProfileDto } from './dto/create-entity-profile.dto';
import { UpdateEntityProfileDto } from './dto/update-entity-profile.dto';

@Controller('entity-profile')
export class EntityProfileController {
  constructor(private readonly entityProfileService: EntityProfileService) {}

  @Post()
  create(@Body() createEntityProfileDto: CreateEntityProfileDto) {
    return this.entityProfileService.create(createEntityProfileDto);
  }

  @Get()
  findAll() {
    return this.entityProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entityProfileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntityProfileDto: UpdateEntityProfileDto) {
    return this.entityProfileService.update(id, updateEntityProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entityProfileService.remove(id);
  }
}
