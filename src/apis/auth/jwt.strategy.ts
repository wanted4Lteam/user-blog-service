import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * @param jwtFromRequest 사용자 요청으로부터 JWT 추출
   * @param ignoreExpiration false(default)로, passport 모듈에 JWT 만료 검증 권한 위임
   * @param secretOrKey PEM 공개키로, 외부 노출 금지 (.env)
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * JWT 토큰 검증 후 JSON decode, 유효한 토큰 발급 보장
   * 사용자 id, name 포함하는 객체 반환
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
