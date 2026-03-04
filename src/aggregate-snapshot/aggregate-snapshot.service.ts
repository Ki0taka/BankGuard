import { Injectable } from '@nestjs/common';
import { AggregateSnapshotRepository } from './aggregate-snapshot.repository';
import { CreateAggregateSnapshotDto } from './dto/create-aggregate-snapshot.dto';
import { UpdateAggregateSnapshotDto } from './dto/update-aggregate-snapshot.dto';

@Injectable()
export class AggregateSnapshotService {
  constructor(private readonly aggregateSnapshotRepository: AggregateSnapshotRepository) {}

  create(createAggregateSnapshotDto: CreateAggregateSnapshotDto) {
    return 'This action adds a new aggregateSnapshot';
  }

  findAll() {
    return `This action returns all aggregateSnapshot`;
  }

  findOne(id: string) {
    return `This action returns a #aggregateSnapshot id`;
  }

  update(id: string, updateAggregateSnapshotDto: UpdateAggregateSnapshotDto) {
    return `This action updates a #aggregateSnapshot id`;
  }

  remove(id: string) {
    return `This action removes a #aggregateSnapshot id`;
  }
}
