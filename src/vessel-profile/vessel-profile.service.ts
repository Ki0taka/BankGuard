import { Injectable } from '@nestjs/common';
import { VesselProfileRepository } from './vessel-profile.repository';
import { CreateVesselProfileDto } from './dto/create-vessel-profile.dto';
import { UpdateVesselProfileDto } from './dto/update-vessel-profile.dto';

@Injectable()
export class VesselProfileService {
  constructor(private readonly vesselProfileRepository: VesselProfileRepository) {}

  create(createVesselProfileDto: CreateVesselProfileDto) {
    return 'This action adds a new vesselProfile';
  }

  findAll() {
    return `This action returns all vesselProfile`;
  }

  findOne(id: string) {
    return `This action returns a #vesselProfile id`;
  }

  update(id: string, updateVesselProfileDto: UpdateVesselProfileDto) {
    return `This action updates a #vesselProfile id`;
  }

  remove(id: string) {
    return `This action removes a #vesselProfile id`;
  }
}
