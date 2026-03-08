import { Injectable } from '@nestjs/common';
import { ExternalSourceRepository } from './external-source.repository';
import { CreateExternalSourceDto } from './dto/create-external-source.dto';
import { UpdateExternalSourceDto } from './dto/update-external-source.dto';

@Injectable()
export class ExternalSourceService {
  constructor(
    private readonly externalSourceRepository: ExternalSourceRepository,
  ) {}

  create(createExternalSourceDto: CreateExternalSourceDto) {
    return 'This action adds a new externalSource';
  }

  findAll() {
    return `This action returns all externalSource`;
  }

  findOne(id: string) {
    return `This action returns a #externalSource id`;
  }

  update(id: string, updateExternalSourceDto: UpdateExternalSourceDto) {
    return `This action updates a #externalSource id`;
  }

  remove(id: string) {
    return `This action removes a #externalSource id`;
  }
}
