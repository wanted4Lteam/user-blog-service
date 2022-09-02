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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { NoticeInputDto } from './dto/notice_board.input';
import { NoticeBoardService } from './notice_board.service';

@Controller('noticeboards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NoticeBoardController {
  constructor(private readonly noticeBoardService: NoticeBoardService) {
    this.noticeBoardService = noticeBoardService;
  }

  @Get()
  @Rules('admin', 'gold', 'silver')
  getAll() {
    return this.noticeBoardService.getAllNotice();
  }

  @Post()
  @Rules('admin', 'gold')
  create(@Body() noticeInputDto: NoticeInputDto, @Req() req) {
    const user_id = req.user.userId;
    return this.noticeBoardService.saveNotice(noticeInputDto, user_id);
  }

  @Put(':id')
  @Rules('admin', 'gold')
  update(@Param('id') id: string, @Body() noticeInputDto: NoticeInputDto, @Req() req) {
    const user_id = req.user.userId;
    return this.noticeBoardService.updateNotice(id, noticeInputDto, user_id);
  }

  @Delete(':id')
  @Rules('admin', 'gold')
  delete(@Param('id') id: string, @Req() req) {
    const user_id = req.user.userId;
    return this.noticeBoardService.deleteNotice(id, user_id);
  }

  @Get(':id')
  @Rules('admin', 'gold', 'silver')
  detail(@Param('id') id: string) {
    return this.noticeBoardService.detailNotice(id);
  }
}
