import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UserModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
