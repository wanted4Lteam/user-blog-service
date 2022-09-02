import { Module } from '@nestjs/common';
import { OperationBoardService } from './operation_board.service';
import { OperationBoardController } from './operation_board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation_Board } from './entities/operation_board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operation_Board])],
  providers: [OperationBoardService],
  controllers: [OperationBoardController]
})
export class OperationBoardModule {}
