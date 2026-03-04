import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalSourceService } from './external-source.service';
import { ExternalSourceController } from './external-source.controller';
import { ExternalSourceRepository } from './external-source.repository';
import { ExternalSource } from './entities/external-source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExternalSource])],
  controllers: [ExternalSourceController],
  providers: [ExternalSourceService, ExternalSourceRepository],
  exports: [ExternalSourceService, ExternalSourceRepository],
})
export class ExternalSourceModule {}
