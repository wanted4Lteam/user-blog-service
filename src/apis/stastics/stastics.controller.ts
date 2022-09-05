import { Body, Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StasticsService } from './stastics.service';

@ApiTags('통계')
@Controller('stastics')
export class StasticsController {
  constructor(private readonly stasticsService: StasticsService) {}

  @Get()
  async findByGender() {}

  @Get()
  async findByAge() {}

  @Get()
  async findByConnected() {}
}
