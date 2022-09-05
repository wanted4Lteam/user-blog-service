import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OperationInputDto } from './dto/operation_board.input';
import { Operation_Board } from './entities/operation_board.entity';
import { OperationBoardService } from './operation_board.service';

describe('OperationBoardService', () => {
  let operationBoardService: OperationBoardService;

  const mockOperationBoardRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationBoardService,
        {
          provide: getRepositoryToken(Operation_Board),
          useValue: mockOperationBoardRepository,
        },
      ],
    }).compile();

    operationBoardService = module.get<OperationBoardService>(
      OperationBoardService,
    );
    mockOperationBoardRepository.create.mockClear();
    mockOperationBoardRepository.create.mockClear();
    mockOperationBoardRepository.find.mockClear();
    mockOperationBoardRepository.findOne.mockClear();
    mockOperationBoardRepository.update.mockClear();
    mockOperationBoardRepository.softDelete.mockClear();
  });

  it('should be defined', () => {
    expect(operationBoardService).toBeDefined();
  });

  describe('saveOperation', () => {
    it('운영 게시판 게시글 작성', async () => {
      //given
      const createBoard: Operation_Board = {
        id: '',
        user_id: 'user',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      mockOperationBoardRepository.create.mockImplementation(
        ({ title, content, user_id }) => createBoard,
      );
      mockOperationBoardRepository.save.mockImplementation((general) => {
        Promise.resolve(createBoard);
      });

      //when
      const input: OperationInputDto = {
        title: '제목',
        content: '내용',
      };
      const user_id: string = 'user';

      const result = await operationBoardService.saveOperation(input, user_id);

      //then
      expect(result.data).toEqual(createBoard);
      expect(result.statusCode).toEqual(201);
      expect(result.message).toEqual('운영게시판에 등록되었습니다.');
      expect(mockOperationBoardRepository.create).toHaveBeenCalledTimes(1);
      expect(mockOperationBoardRepository.save).toHaveBeenCalledTimes(1);
      expect(mockOperationBoardRepository.create).toHaveBeenCalledWith({
        ...input,
        user_id,
      });
      expect(mockOperationBoardRepository.save).toHaveBeenCalledWith(
        createBoard,
      );
    });
  });

  describe('getAllOperation', () => {
    it('게시판 전체 조회 성공', async () => {
      //given
      const findBoards: Operation_Board[] = [
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
      mockOperationBoardRepository.find.mockImplementation(() =>
        Promise.resolve(findBoards),
      );

      //when
      const result = await operationBoardService.getAllOperation();

      //then
      expect(result.data).toEqual(findBoards);
      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual(
        '운영게시판 전체 목록 조회가 완료되었습니다.',
      );
      expect(mockOperationBoardRepository.find).toHaveBeenCalledTimes(1);
      expect(mockOperationBoardRepository.find).toHaveBeenCalledWith();
    });
    it('게시판 전체 조회 실패', async () => {
      //given
      mockOperationBoardRepository.find.mockImplementation(() => []);

      //when
      const result = operationBoardService.getAllOperation();

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: '운영게시판 목록이 없습니다.',
        }),
      );
      expect(mockOperationBoardRepository.find).toHaveBeenCalledTimes(1);
      expect(mockOperationBoardRepository.find).toHaveBeenCalledWith();
    });
  });

  describe('findOperationById', () => {
    it('게시글 조회 성공', async () => {
      //given
      const findBoard: Operation_Board = {
        id: '1',
        user_id: '사용자',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      mockOperationBoardRepository.findOne.mockImplementation(
        (board_id) => findBoard,
      );

      //when
      const board_id = '1';

      const result = await operationBoardService.findOperationById(board_id);

      //then
      expect(result).toEqual(findBoard);
      expect(mockOperationBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockOperationBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: board_id },
      });
    });
    it('게시글 조회 실패', async () => {
      //given
      mockOperationBoardRepository.findOne.mockImplementation(() => null);

      //when
      const board_id = '';

      const result = operationBoardService.findOperationById(board_id);

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: 'Not Found Operation_Board ID',
        }),
      );
      expect(mockOperationBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockOperationBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: board_id },
      });
    });
  });

  describe('detailOperation', () => {
    it('단일 게시글 조회 성공', async () => {
      //given
      const findBoard: Operation_Board = {
        id: '1',
        user_id: 'user',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const mockOperationBoardService = jest
        .spyOn(operationBoardService, 'findOperationById')
        .mockResolvedValue(findBoard);

      //when
      const board_id = '1';

      const result = await operationBoardService.detailOperation(board_id);

      //then
      expect(result.data).toEqual(findBoard);
      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual(
        '운영게시판 게시글 조회가 완료되었습니다.',
      );
      expect(mockOperationBoardService).toHaveBeenCalledTimes(1);
      expect(mockOperationBoardService).toHaveBeenCalledWith(board_id);
    });
    it('단일 게시글 조회 실패', async () => {
      //given
      const mockGeneralBoardService = jest
        .spyOn(operationBoardService, 'findOperationById')
        .mockResolvedValue(null);

      //when
      const board_id = '';

      const result = operationBoardService.detailOperation(board_id);

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: 'Not Found Operation_Board ID',
        }),
      );
      expect(mockGeneralBoardService).toHaveBeenCalledTimes(1);
      expect(mockGeneralBoardService).toHaveBeenCalledWith(board_id);
    });
  });

  describe('updateOperation', () => {
    it('게시글 수정 성공', async () => {
      //given
      const findBoard: Operation_Board = {
        id: '1',
        user_id: 'user',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const updateBoard: Operation_Board = {
        id: '1',
        user_id: 'user',
        title: '제목 수정',
        content: '내용 수정',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const mockOperationBoardService = jest
        .spyOn(operationBoardService, 'findOperationById')
        .mockResolvedValueOnce(findBoard)
        .mockResolvedValueOnce(updateBoard);

      mockOperationBoardRepository.update.mockImplementation((id, input) =>
        Promise.resolve(updateBoard),
      );

      //when
      const board_id = '1';
      const user_id = 'user';
      const input: OperationInputDto = {
        title: '제목 수정',
        content: '내용 수정',
      };

      const result = await operationBoardService.updateOperation(
        board_id,
        input,
        user_id,
      );

      //then
      expect(result.data).toEqual(updateBoard);
      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual('게시글이 수정되었습니다.');
      expect(mockOperationBoardService).toHaveBeenCalledTimes(2);
      expect(mockOperationBoardService).toHaveBeenCalledWith(board_id);
    });
    it('게시글 수정 권한 없음', async () => {
      //given
      const findBoard: Operation_Board = {
        id: '1',
        user_id: 'user',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const mockOperationBoardService = jest
        .spyOn(operationBoardService, 'findOperationById')
        .mockResolvedValueOnce(findBoard);

      mockOperationBoardRepository.update.mockImplementation((id, input) =>
        Promise.resolve(findBoard),
      );

      //when
      const board_id = '1';
      const user_id = 'another user';
      const input: OperationInputDto = {
        title: '제목 수정',
        content: '내용 수정',
      };

      const result = await operationBoardService.updateOperation(
        board_id,
        input,
        user_id,
      );

      //then
      expect(result).toEqual({
        statusCode: 401,
        message: '수정 권한이 없습니다.',
      });
      expect(mockOperationBoardService).toHaveBeenCalledTimes(1);
      expect(mockOperationBoardService).toHaveBeenCalledWith(board_id);
    });
    it('존재하지 않는 게시글 수정', async () => {
      //given
      const findBoard: Operation_Board = null;

      const mockOperationBoardService = jest
        .spyOn(operationBoardService, 'findOperationById')
        .mockRejectedValue(
          new NotFoundException({
            statusCode: 404,
            message: 'Not Found Operation_Board ID',
          }),
        );

      //when
      const board_id = '';
      const user_id = 'user';
      const input: OperationInputDto = {
        title: '제목 수정',
        content: '내용 수정',
      };

      const result = operationBoardService.updateOperation(
        board_id,
        input,
        user_id,
      );

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: 'Not Found Operation_Board ID',
        }),
      );
      expect(mockOperationBoardService).toHaveBeenCalledTimes(1);
      expect(mockOperationBoardService).toHaveBeenCalledWith(board_id);
    });
  });

  describe('deleteOperation', () => {
    it('게시글 삭제 성공', async () => {
      //given
      const findBoard: Operation_Board = {
        id: '1',
        user_id: 'user',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const mockOperationBoardService = jest
        .spyOn(operationBoardService, 'findOperationById')
        .mockResolvedValueOnce(findBoard);

      mockOperationBoardRepository.softDelete.mockImplementation((board_id) => {
        Promise.resolve({
          generatedMaps: [],
          raw: [],
          affected: 1,
        });
      });

      //when
      const board_id = '';
      const user_id = 'user';

      const result = await operationBoardService.deleteOperation(
        board_id,
        user_id,
      );

      //then
      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual('게시글이 삭제되었습니다.');
      expect(mockOperationBoardService).toHaveBeenCalledTimes(1);
      expect(mockOperationBoardService).toHaveBeenCalledWith(board_id);
      expect(mockOperationBoardRepository.softDelete).toHaveBeenCalledTimes(1);
    });
    it('게시글 삭제 권한 없음', async () => {
      //given
      const findBoard: Operation_Board = {
        id: '1',
        user_id: 'user',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const mockOperationBoardService = jest
        .spyOn(operationBoardService, 'findOperationById')
        .mockResolvedValueOnce(findBoard);

      mockOperationBoardRepository.softDelete.mockImplementation((board_id) => {
        Promise.resolve({
          generatedMaps: [],
          raw: [],
          affected: 0,
        });
      });

      //when
      const board_id = '1';
      const user_id = 'another user';

      const result = await operationBoardService.deleteOperation(
        board_id,
        user_id,
      );

      //then
      expect(result.statusCode).toEqual(401);
      expect(result.message).toEqual('삭제 권한이 없습니다.');
      expect(mockOperationBoardService).toHaveBeenCalledTimes(1);
      expect(mockOperationBoardRepository.softDelete).toHaveBeenCalledTimes(0);
    });
  });
});
