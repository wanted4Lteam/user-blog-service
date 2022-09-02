import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { NoticeInputDto } from './dto/notice_board.input';
import { NoticeBoardService } from './notice_board.service';

@Controller('noticeboards')
@ApiTags('공지사항')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NoticeBoardController {
  constructor(private readonly noticeBoardService: NoticeBoardService) {
    this.noticeBoardService = noticeBoardService;
  }

  @Get()
  @ApiOperation({
    summary: '공지사항 전체조회 API',
    description: '공지사항 전체 게시글을 조회합니다.',
  })
  @Rules('admin', 'gold', 'silver')
  getAll() {
    return this.noticeBoardService.getAllNotice();
  }

  @Post()
  @ApiOperation({
    summary: '공지사항 Create API',
    description: '공지사항을 작성합니다.',
  })
  @Rules('admin', 'gold')
  create(@Body() noticeInputDto: NoticeInputDto, @Req() req) {
    const user_id = req.user.userId;
    return this.noticeBoardService.saveNotice(noticeInputDto, user_id);
  }

  @Put(':id')
  @ApiOperation({
    summary: '공지사항 Update API',
    description: '공지사항을 수정합니다.',
  })
  @Rules('admin', 'gold')
  update(@Param('id') id: string, @Body() noticeInputDto: NoticeInputDto, @Req() req) {
    const user_id = req.user.userId;
    return this.noticeBoardService.updateNotice(id, noticeInputDto, user_id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '공지사항 Delete API',
    description: '공지사항을 삭제합니다.',
  })
  @Rules('admin', 'gold')
  delete(@Param('id') id: string, @Req() req) {
    const user_id = req.user.userId;
    return this.noticeBoardService.deleteNotice(id, user_id);
  }

  @Get(':id')
  @ApiOperation({
    summary: '공지사항 Detail API',
    description: '공지사항 게시글을 조회합니다.',
  })
  @Rules('admin', 'gold', 'silver')
  detail(@Param('id') id: string) {
    return this.noticeBoardService.detailNotice(id);
  }
}
