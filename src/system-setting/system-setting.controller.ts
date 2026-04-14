import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { SystemSettingService } from './system-setting.service';

@Controller('system-settings')
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
