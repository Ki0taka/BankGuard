import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SystemSettingService } from './system-setting.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';

@Controller('system-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
export class SystemSettingController {
  constructor(private readonly service: SystemSettingService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':key')
  async findOne(@Param('key') key: string) {
    return { value: await this.service.get(key) };
  }

  @Patch(':key')
  async update(@Param('key') key: string, @Body() body: { value: string }) {
    await this.service.set(key, body.value);
    return { success: true, key, value: body.value };
  }
}
