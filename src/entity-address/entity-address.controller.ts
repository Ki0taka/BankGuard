import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntityAddressService } from './entity-address.service';
import { CreateEntityAddressDto } from './dto/create-entity-address.dto';
import { UpdateEntityAddressDto } from './dto/update-entity-address.dto';

@Controller('entity-address')
export class EntityAddressController {
  constructor(private readonly entityAddressService: EntityAddressService) {}

  @Post()
  create(@Body() createEntityAddressDto: CreateEntityAddressDto) {
    return this.entityAddressService.create(createEntityAddressDto);
  }

  @Get()
  findAll() {
    return this.entityAddressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entityAddressService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntityAddressDto: UpdateEntityAddressDto) {
    return this.entityAddressService.update(id, updateEntityAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entityAddressService.remove(id);
  }
}
