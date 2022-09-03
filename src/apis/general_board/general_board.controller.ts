import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GeneralInputDto } from './dto/general_board.input';
import { GeneralBoardService } from './general_board.service';

@Controller('generalboards')
@ApiTags('자유게시판')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GeneralBoardController {
  constructor(private readonly generalBoardService: GeneralBoardService) {
    this.generalBoardService = generalBoardService;
  }

  @Post()
  @ApiOperation({
    summary: '자유게시판 Create API',
    description: '자유게시판 게시글을 작성합니다.',
  })
  @Rules('admin', 'gold', 'silver')
  create(@Body() generalInputDto: GeneralInputDto, @Req() req) {
    const user_id = req.user.userId;
    return this.generalBoardService.saveGeneral(generalInputDto, user_id);
  }

  @Get()
  @ApiOperation({
    summary: '자유게시판 전체조회 API',
    description: '자유게시판 전체 게시글을 조회합니다.',
  })
  @Rules('admin', 'gold', 'silver')
  getAll() {
    return this.generalBoardService.getAllGeneral();
  }
}
