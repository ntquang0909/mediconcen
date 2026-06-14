import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MappingsService } from './mappings.service';
import { CreateMappingDto } from './dto/create-mapping.dto';

@Controller('mappings')
export class MappingsController {
  constructor(private readonly mappingsService: MappingsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createMapping(@Body() createMappingDto: CreateMappingDto) {
    return this.mappingsService.processMapping(
      createMappingDto.id1,
      createMappingDto.id2,
    );
  }
}
