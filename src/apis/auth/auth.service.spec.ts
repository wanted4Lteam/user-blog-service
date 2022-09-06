import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Grade } from '../user/entities/user.entity';

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
    mockJwtService.sign.mockClear();
    mockUserService.findOne.mockClear();
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

  describe('validateUser', () => {
    it('사용자 확인 성공', async () => {
      //given
      mockUserService.findOne.mockImplementation((email) =>
        Promise.resolve({
          id: '1',
          grade: Grade.SILVER,
          lastconnect_date: null,
          createDate: 20220902,
          updateDate: 20220902,
          deleteAt: null,
          email: 'abcd@gmail.com',
          name: '사용자',
          gender: '남성',
          age: 20,
          password: '1234',
          phone: '010-1234-5678',
        }),
      );

      //when
      const result = await authService.validateUser('abcd@gmail.com', '1234');

      //then
      expect(result).toEqual({
        id: '1',
        grade: Grade.SILVER,
        lastconnect_date: null,
        createDate: 20220902,
        updateDate: 20220902,
        deleteAt: null,
        email: 'abcd@gmail.com',
        name: '사용자',
        gender: '남성',
        age: 20,
        phone: '010-1234-5678',
      });
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith('abcd@gmail.com');
    });
    it('사용자 조회 실패', async () => {
      //given
      mockUserService.findOne.mockImplementation((email) =>
        Promise.resolve(null),
      );

      //when
      const result = await authService.validateUser('qwer@gmail.com', '1234');

      //then
      expect(result).toEqual(null);
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith('qwer@gmail.com');
    });
    it('비밀번호 불일치', async () => {
      //given
      mockUserService.findOne.mockImplementation((email) =>
        Promise.resolve({
          id: '1',
          grade: Grade.SILVER,
          lastconnect_date: null,
          createDate: 20220902,
          updateDate: 20220902,
          deleteAt: null,
          email: 'qwer@gmail.com',
          name: '사용자',
          gender: '남성',
          age: 20,
          password: 'zxcv',
          phone: '010-1234-5678',
        }),
      );

      //when
      const result = await authService.validateUser('qwer@gmail.com', '1234');

      //then
      expect(result).toEqual(null);
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith('qwer@gmail.com');
    });
  });
});
