import { Injectable } from '@nestjs/common';
import { SyncRunRepository } from './sync-run.repository';
import { CreateSyncRunDto } from './dto/create-sync-run.dto';
import { UpdateSyncRunDto } from './dto/update-sync-run.dto';

@Injectable()
export class SyncRunService {
  constructor(private readonly syncRunRepository: SyncRunRepository) {}

  create(createSyncRunDto: CreateSyncRunDto) {
    return 'This action adds a new syncRun';
  }

  findAll() {
    return `This action returns all syncRun`;
  }

  findOne(id: string) {
    return `This action returns a #syncRun id`;
  }

  update(id: string, updateSyncRunDto: UpdateSyncRunDto) {
    return `This action updates a #syncRun id`;
  }

  remove(id: string) {
    return `This action removes a #syncRun id`;
  }
}
