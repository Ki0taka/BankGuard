import { Injectable } from '@nestjs/common';
import { IndividualProfileRepository } from './individual-profile.repository';
import { CreateIndividualProfileDto } from './dto/create-individual-profile.dto';
import { UpdateIndividualProfileDto } from './dto/update-individual-profile.dto';

@Injectable()
export class IndividualProfileService {
  constructor(
    private readonly individualProfileRepository: IndividualProfileRepository,
  ) {}

  create(createIndividualProfileDto: CreateIndividualProfileDto) {
    return 'This action adds a new individualProfile';
  }

  findAll() {
    return `This action returns all individualProfile`;
  }

  findOne(id: string) {
    return `This action returns a #individualProfile id`;
  }

  update(id: string, updateIndividualProfileDto: UpdateIndividualProfileDto) {
    return `This action updates a #individualProfile id`;
  }

  remove(id: string) {
    return `This action removes a #individualProfile id`;
  }
}
