import { Body, Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Rules } from '../auth/roles.decorator';
import { StasticsService } from './stastics.service';

@ApiTags('통계')
@Controller('stastics')
export class StasticsController {
  constructor(private readonly stasticsService: StasticsService) {}

  @Get('all')
  @ApiOperation({
    summary: '모든 사용자 조회 API',
    description: '등록된 모든 사용자를 조회합니다.',
  })
  @Rules('admin')
  async getAll() {
    return await this.stasticsService.getAll();
  }

  @Get(':gender')
  @ApiOperation({
    summary: '성별에 따른 사용자 조회 API',
    description: '남성, 또는 여성 사용자만을 조회합니다.',
  })
  async findByGender(@Param('gender') gender: string) {
    return await this.stasticsService.findByGender(gender);
  }

  @Get()
  async findByAge(@Param('age') age: number) {}

  @Get()
  async findByConnected() {}
}
