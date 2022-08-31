import { Body, Controller, Get, Post } from '@nestjs/common';
import { NoticeSaveDto } from './dto/notice_board.save';
import { NoticeBoardService } from './notice_board.service';

@Controller('noticeboards')
export class NoticeBoardController {
    constructor(private readonly noticeBoardService: NoticeBoardService) {}

    @Get()
    getAll() {
        return this.noticeBoardService.getAll();
    }

    @Post()
    save(@Body() body: NoticeSaveDto) {
        return this.noticeBoardService.save(body);
    }
    

}
