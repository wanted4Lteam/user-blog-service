import { Module } from '@nestjs/common';
import { NoticeBoardController } from './notice_board.controller';
import { NoticeBoardService } from './notice_board.service';

@Module({
  controllers: [NoticeBoardController],
  providers: [NoticeBoardService]
})
export class NoticeBoardModule {}
