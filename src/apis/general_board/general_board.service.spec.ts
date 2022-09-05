import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeneralInputDto } from './dto/general_board.input';
import { General_Board } from './entities/general_board.entity';
import { GeneralBoardService } from './general_board.service';

describe('GeneralBoardService', () => {
  let generalBoardService: GeneralBoardService;

  const mockGeneralBoardRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneralBoardService,
        {
          provide: getRepositoryToken(General_Board),
          useValue: mockGeneralBoardRepository,
        },
      ],
    }).compile();

    generalBoardService = module.get<GeneralBoardService>(GeneralBoardService);
    mockGeneralBoardRepository.create.mockClear();
    mockGeneralBoardRepository.find.mockClear();
    mockGeneralBoardRepository.save.mockClear();
    mockGeneralBoardRepository.findOne.mockClear();
    mockGeneralBoardRepository.update.mockClear();
  });

  it('should be defined', () => {
    expect(generalBoardService).toBeDefined();
  });

  describe('saveGeneral', () => {
    it('자유 게시판 게시글 작성', async () => {
      //given
      const createBoard: General_Board = {
        title: '제목',
        content: '내용',
        user_id: 'pk',
        id: '',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      mockGeneralBoardRepository.create.mockImplementation(
        ({ title, content, user_id }) => createBoard,
      );
      mockGeneralBoardRepository.save.mockImplementation((general) => {
        Promise.resolve({ title: 1 });
      });
      //when
      const input: GeneralInputDto = { title: '제목', content: '내용' };
      const user_id: string = 'pk';

      const result = await generalBoardService.saveGeneral(input, user_id);

      //then
      expect(result.data).toEqual({
        ...createBoard,
      });
      expect(result.message).toEqual('자유게시판 게시글이 등록되었습니다.');
      expect(result.statusCode).toEqual(201);
      expect(mockGeneralBoardRepository.create).toHaveBeenCalledTimes(1);
      expect(mockGeneralBoardRepository.save).toHaveBeenCalledTimes(1);
      expect(mockGeneralBoardRepository.create).toHaveBeenCalledWith({
        ...input,
        user_id,
      });
      expect(mockGeneralBoardRepository.save).toHaveBeenCalledWith(createBoard);
    });
  });

  describe('getAllGeneral', () => {
    it('게시판 전체 조회 성공', async () => {
      //given
      const findBoards: General_Board[] = [
        {
          title: '제목1',
          content: '내용1',
          user_id: '1',
          id: '',
          createdAt: undefined,
          updateAt: undefined,
          deleteAt: undefined,
          user: null,
        },
        {
          title: '제목2',
          content: '내용2',
          user_id: '2',
          id: '',
          createdAt: undefined,
          updateAt: undefined,
          deleteAt: undefined,
          user: null,
        },
      ];
      mockGeneralBoardRepository.find.mockImplementation(() =>
        Promise.resolve(findBoards),
      );

      //when
      const result = await generalBoardService.getAllGeneral();

      //then
      expect(result.data).toEqual(findBoards);
      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual(
        '자유게시판 전체 목록 조회가 완료되었습니다.',
      );
      expect(mockGeneralBoardRepository.find).toHaveBeenCalledTimes(1);
      expect(mockGeneralBoardRepository.find).toHaveBeenCalledWith();
    });
    it('게시판 전체 조회 실패', async () => {
      //given
      mockGeneralBoardRepository.find.mockImplementation(() => []);

      //when
      const result = generalBoardService.getAllGeneral();

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: '자유게시판 목록이 없습니다.',
        }),
      );
      expect(mockGeneralBoardRepository.find).toHaveBeenCalledTimes(1);
      expect(mockGeneralBoardRepository.find).toHaveBeenCalledWith();
    });
  });

  describe('findGeneralById', () => {
    it('게시글 조회 성공', async () => {
      //given
      const findBoard: General_Board = {
        id: '1',
        user_id: '사용자',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      mockGeneralBoardRepository.findOne.mockImplementation(
        (board_id) => findBoard,
      );

      //when
      const board_id = '1';

      const result = await generalBoardService.findGeneralById(board_id);

      //then
      expect(result).toEqual(findBoard);
      expect(mockGeneralBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockGeneralBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: board_id },
      });
    });
    it('게시글 조회 실패', async () => {
      //given
      mockGeneralBoardRepository.findOne.mockImplementation(() => null);

      //when
      const board_id = '';

      const result = generalBoardService.findGeneralById(board_id);

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: 'Not Found General_Board ID',
        }),
      );
      expect(mockGeneralBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockGeneralBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: board_id },
      });
    });
  });

  describe('detailGeneral', () => {
    it('단일 게시글 조회', async () => {
      //given
      const findBoard: General_Board = {
        id: '1',
        user_id: 'user',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const mockGeneralBoardService = jest
        .spyOn(generalBoardService, 'findGeneralById')
        .mockResolvedValue(findBoard);

      //when
      const board_id = '1';

      const result = await generalBoardService.detailGeneral(board_id);

      //then
      expect(result.data).toEqual(findBoard);
      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual(
        '자유게시판 게시글 조회가 완료되었습니다.',
      );
      expect(mockGeneralBoardService).toHaveBeenCalledTimes(1);
      expect(mockGeneralBoardService).toHaveBeenCalledWith(board_id);
    });
    it('단일 게시글 조회 실패', async () => {
      //given
      const mockGeneralBoardService = jest
        .spyOn(generalBoardService, 'findGeneralById')
        .mockResolvedValue(null);

      //when
      const board_id = '';

      const result = generalBoardService.detailGeneral(board_id);

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: 'Not Found general_Board ID',
        }),
      );
      expect(mockGeneralBoardService).toHaveBeenCalledTimes(1);
      expect(mockGeneralBoardService).toHaveBeenCalledWith(board_id);
    });
  });

  describe('updateGeneral', () => {
    it('게시글 수정 성공', async () => {
      //given
      const findBoard: General_Board = {
        id: '1',
        user_id: 'user',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const updateBoard: General_Board = {
        id: '1',
        user_id: 'user',
        title: '제목 수정',
        content: '내용 수정',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const mockGeneralBoardService = jest
        .spyOn(generalBoardService, 'findGeneralById')
        .mockResolvedValueOnce(findBoard)
        .mockResolvedValueOnce(updateBoard);

      mockGeneralBoardRepository.update.mockImplementation((id, input) =>
        Promise.resolve(updateBoard),
      );

      //when
      const board_id = '1';
      const user_id = 'user';
      const input: GeneralInputDto = {
        title: '제목 수정',
        content: '내용 수정',
      };

      const result = await generalBoardService.updateGeneral(
        board_id,
        input,
        user_id,
      );

      //then
      expect(result.data).toEqual(updateBoard);
      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual('게시글이 수정되었습니다.');
      expect(mockGeneralBoardService).toHaveBeenCalledTimes(2);
      expect(mockGeneralBoardService).toHaveBeenCalledWith(board_id);
    });
    it('게시글 수정 권한 없음', async () => {
      //given
      const findBoard: General_Board = {
        id: '1',
        user_id: 'user',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const mockGeneralBoardService = jest
        .spyOn(generalBoardService, 'findGeneralById')
        .mockResolvedValueOnce(findBoard);

      mockGeneralBoardRepository.update.mockImplementation((id, input) =>
        Promise.resolve(findBoard),
      );

      //when
      const board_id = '1';
      const user_id = 'another user';
      const input: GeneralInputDto = {
        title: '제목 수정',
        content: '내용 수정',
      };

      const result = await generalBoardService.updateGeneral(
        board_id,
        input,
        user_id,
      );

      //then
      expect(result).toEqual({
        statusCode: 401,
        message: '수정 권한이 없습니다.',
      });
      expect(mockGeneralBoardService).toHaveBeenCalledTimes(1);
      expect(mockGeneralBoardService).toHaveBeenCalledWith(board_id);
    });
  });
});
