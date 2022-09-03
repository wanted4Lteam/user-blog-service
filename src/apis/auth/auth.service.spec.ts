import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let authService: AuthService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('로그인', async () => {
      //given
      mockJwtService.sign.mockReturnValue('access_token');

      //when
      const loginUser = {
        id: '1',
        email: 'abcd@gmail.com',
      };

      const result = await authService.login(loginUser);

      ///then
      expect(result).toEqual({ access_token: 'access_token' });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: loginUser.id,
        email: loginUser.email,
      });
    });
  });
});
