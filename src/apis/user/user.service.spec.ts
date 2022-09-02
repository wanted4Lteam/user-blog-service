import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserInput } from 'src/apis/user/dto/user.input';
import { Grade, User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    save: jest.fn(),
    softDelete: jest.fn(),
    findOneBy: jest.fn(),
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
    mockUserRepository.save.mockClear();
    mockUserRepository.findOneBy.mockClear();
    mockUserRepository.softDelete.mockClear();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('회원가입을 진행 후 user 반환.', async () => {
      //given
      mockUserRepository.save.mockImplementation((user) =>
        Promise.resolve({
          id: '1',
          grade: Grade.SILVER,
          lastconnect_date: null,
          createDate: 20220902,
          updateDate: 20220902,
          deleteAt: null,
          ...user,
        }),
      );

      //when
      const createUser: UserInput = {
        email: 'abcd@gmail.com',
        name: '사용자',
        gender: '남성',
        age: 20,
        password: '1234',
        phone: '010-1234-5678',
      };

      const result = await userService.create({ input: createUser });

      //then
      expect(result).toEqual({
        id: '1',
        grade: Grade.SILVER,
        lastconnect_date: null,
        createDate: 20220902,
        updateDate: 20220902,
        deleteAt: null,
        ...createUser,
      });
    });
  });

  describe('deleteUser', () => {
    it('회원탈퇴', async () => {
      //given
      mockUserRepository.softDelete.mockImplementation((id) =>
        Promise.resolve({
          generatedMaps: [],
          raw: [],
          affected: 1,
        }),
      );

      //when
      const id: String = '1';

      const result = await userService.delete({ id });

      //then
      expect(result).toEqual({
        generatedMaps: [],
        raw: [],
        affected: 1,
      });
    });
    it('id가 blank인 경우 회원탈퇴', async () => {
      //given
      mockUserRepository.softDelete.mockImplementation((id) =>
        Promise.resolve({
          generatedMaps: [],
          raw: [],
          affected: 0,
        }),
      );

      //when
      const id: string = '';

      const result = await userService.delete({ id });

      //then
      expect(result).toEqual({
        generatedMaps: [],
        raw: [],
        affected: 0,
      });
    });
  });

  describe('findOneByEmail', () => {
    it('이메일로 회원조회 성공', async () => {
      //given
      const findUser = {
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
      };

      mockUserRepository.findOneBy.mockImplementation((email: string) =>
        Promise.resolve({
          ...findUser,
        }),
      );

      //when
      const email: string = 'abcd@gmail.com';

      const result = await userService.findOne(email);

      //then
      expect(result).toEqual(findUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email });
    });
    it('존재하지 않는 이메일로 회원조회 실패', async () => {
      //given
      mockUserRepository.findOneBy.mockResolvedValue(null);

      //when
      const email = '1234@gmail.com';

      const result = await userService.findOne(email);

      //then
      expect(result).toBeNull();
      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email });
    });
  });
});
