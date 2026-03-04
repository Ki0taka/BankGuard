import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AggregateSnapshotService } from './aggregate-snapshot.service';
import { CreateAggregateSnapshotDto } from './dto/create-aggregate-snapshot.dto';
import { UpdateAggregateSnapshotDto } from './dto/update-aggregate-snapshot.dto';

@Controller('aggregate-snapshot')
export class AggregateSnapshotController {
  constructor(private readonly aggregateSnapshotService: AggregateSnapshotService) {}

  @Post()
  create(@Body() createAggregateSnapshotDto: CreateAggregateSnapshotDto) {
    return this.aggregateSnapshotService.create(createAggregateSnapshotDto);
  }

  @Get()
  findAll() {
    return this.aggregateSnapshotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aggregateSnapshotService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAggregateSnapshotDto: UpdateAggregateSnapshotDto) {
    return this.aggregateSnapshotService.update(id, updateAggregateSnapshotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aggregateSnapshotService.remove(id);
  }
}
