import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice_Board } from './entities/notice_board.entity';
import { NoticeBoardController } from './notice_board.controller';
import { NoticeBoardService } from './notice_board.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice_Board])],
  controllers: [NoticeBoardController],
  providers: [NoticeBoardService]
})
export class NoticeBoardModule {}
