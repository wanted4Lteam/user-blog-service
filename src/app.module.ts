import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './apis/user/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { NoticeBoardModule } from './apis/notice_board/notice_board.module';
import { OperationBoardModule } from './apis/operation_board/operation_board.module';
import { GeneralBoardModule } from './apis/general_board/general_board.module';
import { StasticsModule } from './apis/stastics/stastics.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: 3306,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),

    NoticeBoardModule,

    OperationBoardModule,

    GeneralBoardModule,

    StasticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
