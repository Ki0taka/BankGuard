import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from './entities/system-setting.entity';

@Injectable()
export class SystemSettingService implements OnModuleInit {
  private readonly logger = new Logger(SystemSettingService.name);

  constructor(
    @InjectRepository(SystemSetting)
    private readonly repository: Repository<SystemSetting>,
  ) {}

  async onModuleInit() {
    await this.ensureSetting(
      'AUTO_DISTRIBUTION_ENABLED',
      'true',
      'Enable or disable automatic batch distribution on validation',
    );
  }

  private async ensureSetting(
    key: string,
    defaultValue: string,
    description: string,
  ) {
    const existing = await this.repository.findOne({ where: { key } });
    if (!existing) {
      await this.repository.save({ key, value: defaultValue, description });
      this.logger.log(`Initialized setting: ${key} = ${defaultValue}`);
    }
  }

  async get(key: string): Promise<string | null> {
    const setting = await this.repository.findOne({ where: { key } });
    return setting ? setting.value : null;
  }

  async getAsBoolean(key: string): Promise<boolean> {
    const val = await this.get(key);
    return val === 'true';
  }

  async set(key: string, value: string) {
    await this.repository.save({ key, value });
    this.logger.log(`Updated setting: ${key} = ${value}`);
  }

  async findAll() {
    return this.repository.find();
  }
}
