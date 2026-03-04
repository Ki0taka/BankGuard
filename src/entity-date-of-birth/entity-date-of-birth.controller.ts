import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntityDateOfBirthService } from './entity-date-of-birth.service';
import { CreateEntityDateOfBirthDto } from './dto/create-entity-date-of-birth.dto';
import { UpdateEntityDateOfBirthDto } from './dto/update-entity-date-of-birth.dto';

@Controller('entity-date-of-birth')
export class EntityDateOfBirthController {
  constructor(private readonly entityDateOfBirthService: EntityDateOfBirthService) {}

  @Post()
  create(@Body() createEntityDateOfBirthDto: CreateEntityDateOfBirthDto) {
    return this.entityDateOfBirthService.create(createEntityDateOfBirthDto);
  }

  @Get()
  findAll() {
    return this.entityDateOfBirthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entityDateOfBirthService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntityDateOfBirthDto: UpdateEntityDateOfBirthDto) {
    return this.entityDateOfBirthService.update(id, updateEntityDateOfBirthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entityDateOfBirthService.remove(id);
  }
}
