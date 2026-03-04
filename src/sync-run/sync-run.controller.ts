import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SyncRunService } from './sync-run.service';
import { CreateSyncRunDto } from './dto/create-sync-run.dto';
import { UpdateSyncRunDto } from './dto/update-sync-run.dto';

@Controller('sync-run')
export class SyncRunController {
  constructor(private readonly syncRunService: SyncRunService) {}

  @Post()
  create(@Body() createSyncRunDto: CreateSyncRunDto) {
    return this.syncRunService.create(createSyncRunDto);
  }

  @Get()
  findAll() {
    return this.syncRunService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.syncRunService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSyncRunDto: UpdateSyncRunDto) {
    return this.syncRunService.update(id, updateSyncRunDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.syncRunService.remove(id);
  }
}
