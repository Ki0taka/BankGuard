import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { RoleEnum } from '../common/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedSuperAdmin();
  }

  async seedSuperAdmin() {
    const adminEmail = this.configService.get<string>(
      'SUPER_ADMIN_EMAIL',
      'superadmin@sims.com',
    );
    const adminPassword = this.configService.get<string>(
      'SUPER_ADMIN_PASSWORD',
      'SuperAdmin123!',
    );

    const existingAdmin = await this.userRepository.findOneBy({
      email: adminEmail,
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const superAdmin = this.userRepository.create({
        name: 'System Root',
        email: adminEmail,
        passwordHash: hashedPassword,
        role: RoleEnum.SUPER_ADMIN,
      });

      await this.userRepository.save(superAdmin);
      console.log('✅ SUPER_ADMIN user created successfully.');
    } else {
      console.log('ℹ️ SUPER_ADMIN user already exists.');
    }
  }
}
