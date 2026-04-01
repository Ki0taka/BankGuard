import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateVesselProfileDto {
  @IsUUID()
  entityProfileId: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  imoNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  mmsi?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  vesselType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  flag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  callSign?: string;
}
