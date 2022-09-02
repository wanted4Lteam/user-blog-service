import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserInput } from 'src/apis/user/dto/user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve({
        id: Date.now(),
        ...user,
      }),
    ),
    softDelete: jest.fn().mockImplementation((id) =>
      Promise.resolve({
        generatedMaps: [],
        raw: [],
        affected: 1,
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('회원가입을 진행 후 user pk 반환.', async () => {
      const createUser: any = {
        email: 'abcd@gmail.com',
        name: '사용자',
        gender: '남성',
        age: 20,
        password: '1234',
        phone: '010-1234-5678',
      };

      const result = await userService.create(createUser);

      expect(result).toEqual({
        id: expect.any(Number),
      });
    });
  });

  describe('deleteUser', () => {
    it('회원탈퇴', async () => {
      const id: String = '1';

      const result = await userService.delete({ id });

      expect(result).toEqual({
        generatedMaps: [],
        raw: [],
        affected: 1,
      });
    });
  });
});
