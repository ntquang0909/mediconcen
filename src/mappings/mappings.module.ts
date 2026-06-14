import { Module } from '@nestjs/common';
import { MappingsService } from './mappings.service';
import { MappingsController } from './mappings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mapping } from './entities/mapping.entity';

@Module({
  controllers: [MappingsController],
  providers: [MappingsService],
  imports: [TypeOrmModule.forFeature([Mapping])],
})
export class MappingsModule {}
