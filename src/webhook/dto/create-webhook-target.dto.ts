import { IsString, IsUrl, IsEnum, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateWebhookTargetDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  secretKey?: string;

  @IsArray()
  @IsString({ each: true })
  eventTypes: string[];

  @IsOptional()
  @IsEnum(['JSON', 'XML', 'EXCEL', 'HMT'])
  format?: 'JSON' | 'XML' | 'EXCEL' | 'HMT';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
