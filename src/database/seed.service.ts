import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { RoleEnum } from '../common/enums/role.enum';
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
      'mohahahamidani1@gmail.com',
    );

    const existingAdmin = await this.userRepository.findOneBy({
      email: adminEmail,
    });

    if (!existingAdmin) {
      const superAdmin = this.userRepository.create({
        firstName: 'System',
        lastName: 'Root',
        email: adminEmail,
        role: RoleEnum.SUPER_ADMIN,
        isConfirmed: true,
      });

      await this.userRepository.save(superAdmin);
      console.log('✅ SUPER_ADMIN user created successfully.');
    } else {
      console.log('ℹ️ SUPER_ADMIN user already exists.');
    }
  }
}
