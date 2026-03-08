import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SyncedEntityService } from './synced-entity.service';
import { CreateSyncedEntityDto } from './dto/create-synced-entity.dto';
import { UpdateSyncedEntityDto } from './dto/update-synced-entity.dto';

@Controller('synced-entity')
export class SyncedEntityController {
  constructor(private readonly syncedEntityService: SyncedEntityService) {}

  @Post()
  create(@Body() createSyncedEntityDto: CreateSyncedEntityDto) {
    return this.syncedEntityService.create(createSyncedEntityDto);
  }

  @Get()
  findAll() {
    return this.syncedEntityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.syncedEntityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSyncedEntityDto: UpdateSyncedEntityDto,
  ) {
    return this.syncedEntityService.update(id, updateSyncedEntityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.syncedEntityService.remove(id);
  }
}
