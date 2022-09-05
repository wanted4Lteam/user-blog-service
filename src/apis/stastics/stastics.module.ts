import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { StasticsController } from './stastics.controller';
import { StasticsService } from './stastics.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [StasticsService],
  controllers: [StasticsController],
})
export class StasticsModule {}
