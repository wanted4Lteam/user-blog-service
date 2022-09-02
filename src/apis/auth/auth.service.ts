import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * DB에 email이 존재하는지 검증
   * email의 password 정보와 입력한 정보가 일치하는지 검증
   *
   * @param email 로그인 id
   * @param pass 로그인 password
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * 로그인 요청 사용자에게 JWT access 토큰 발급
   *
   * @param user 로그인 요청 사용자
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, grade: user.grade };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
