import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { General_Board } from './entities/general_board.entity';
import { GeneralBoardController } from './general_board.controller';
import { GeneralBoardService } from './general_board.service';

@Module({
  imports: [TypeOrmModule.forFeature([General_Board])],
  controllers: [GeneralBoardController],
  providers: [GeneralBoardService],
})
export class GeneralBoardModule {}
