import { Injectable } from '@nestjs/common';
import { SyncedEntityRepository } from './synced-entity.repository';
import { CreateSyncedEntityDto } from './dto/create-synced-entity.dto';
import { UpdateSyncedEntityDto } from './dto/update-synced-entity.dto';

@Injectable()
export class SyncedEntityService {
  constructor(
    private readonly syncedEntityRepository: SyncedEntityRepository,
  ) {}

  create(createSyncedEntityDto: CreateSyncedEntityDto) {
    return 'This action adds a new syncedEntity';
  }

  findAll() {
    return `This action returns all syncedEntity`;
  }

  findOne(id: string) {
    return `This action returns a #syncedEntity id`;
  }

  update(id: string, updateSyncedEntityDto: UpdateSyncedEntityDto) {
    return `This action updates a #syncedEntity id`;
  }

  remove(id: string) {
    return `This action removes a #syncedEntity id`;
  }
}
