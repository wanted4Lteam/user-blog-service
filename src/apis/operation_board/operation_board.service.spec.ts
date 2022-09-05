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
  });
});
