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
import { NoticeInputDto } from './dto/notice_board.input';
import { Notice_Board } from './entities/notice_board.entity';
import { NoticeBoardService } from './notice_board.service';

@Controller('noticeboards')
@UseGuards(JwtAuthGuard)
export class NoticeBoardController {
  constructor(private readonly noticeBoardService: NoticeBoardService) {
    this.noticeBoardService = noticeBoardService;
  }

  @Get()
  getAll() {
    return this.noticeBoardService.getAllNotice();
  }

  @Post()
  create(@Body() noticeInputDto: NoticeInputDto, @Req() req) {
    const user_id = req.user.userId;
    return this.noticeBoardService.saveNotice(noticeInputDto, user_id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() noticeInputDto: NoticeInputDto) {
    return this.noticeBoardService.updateNotice(id, noticeInputDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.noticeBoardService.deleteNotice(id);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.noticeBoardService.detailNotice(id);
  }
}
