import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { NoticeInputDto } from './dto/notice_board.input';
import { NoticeBoardService } from './notice_board.service';

@Controller('noticeboards')
export class NoticeBoardController {
  constructor(private readonly noticeBoardService: NoticeBoardService) {}

  @Get()
  getAll() {
    return this.noticeBoardService.getAllNotice();
  }

  @Post()
  save(@Body() body: NoticeInputDto) {
    return this.noticeBoardService.saveNotice(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: NoticeInputDto) {
    return this.noticeBoardService.updateNotice(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.noticeBoardService.deleteNotice(id);
  }
}
