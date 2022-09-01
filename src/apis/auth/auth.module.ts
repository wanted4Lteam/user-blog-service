import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '100s' },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
