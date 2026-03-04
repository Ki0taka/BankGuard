import { PartialType } from '@nestjs/mapped-types';
import { CreateVesselProfileDto } from './create-vessel-profile.dto';

export class UpdateVesselProfileDto extends PartialType(CreateVesselProfileDto) {}
