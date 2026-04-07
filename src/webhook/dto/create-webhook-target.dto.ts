import { IsString, IsUrl, IsEnum, IsArray, IsOptional, IsBoolean, IsObject } from 'class-validator';

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
  @IsOptional()
  eventTypes?: string[];

  @IsOptional()
  @IsEnum(['JSON', 'XML', 'EXCEL', 'HMT', 'CUSTOM'])
  format?: 'JSON' | 'XML' | 'EXCEL' | 'HMT' | 'CUSTOM';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  mapping?: Record<string, string>;
}
