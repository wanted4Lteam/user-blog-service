import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NoticeInputDto } from './dto/notice_board.input';
import { Notice_Board } from './entities/notice_board.entity';
import { NoticeBoardService } from './notice_board.service';

describe('NoticeBoardService', () => {
  let noticeBoardService: NoticeBoardService;

  const mockNoticeBoardRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticeBoardService,
        {
          provide: getRepositoryToken(Notice_Board),
          useValue: mockNoticeBoardRepository,
        },
      ],
    }).compile();

    noticeBoardService = module.get<NoticeBoardService>(NoticeBoardService);
    mockNoticeBoardRepository.create.mockClear();
    mockNoticeBoardRepository.save.mockClear();
    mockNoticeBoardRepository.find.mockClear();
    mockNoticeBoardRepository.findOne.mockClear();
  });

  describe('saveNotice', () => {
    it('공지사항 작성', async () => {
      //given
      const createBoard: Notice_Board = {
        id: '',
        user_id: 'user',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      mockNoticeBoardRepository.create.mockImplementation(
        ({ title, content, user_id }) => createBoard,
      );
      mockNoticeBoardRepository.save.mockImplementation((general) => {
        Promise.resolve(createBoard);
      });

      //when
      const input: NoticeInputDto = {
        title: '제목',
        content: '내용',
      };
      const user_id: string = 'user';

      const result = await noticeBoardService.saveNotice(input, user_id);

      //then
      expect(result.data).toEqual(createBoard);
      expect(result.statusCode).toEqual(201);
      expect(result.message).toEqual('공지사항이 등록되었습니다.');
      expect(mockNoticeBoardRepository.create).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardRepository.save).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardRepository.create).toHaveBeenCalledWith({
        ...input,
        user_id,
      });
      expect(mockNoticeBoardRepository.save).toHaveBeenCalledWith(createBoard);
    });
  });

  describe('getAllNotice', () => {
    it('공시사항 전체 조회 성공', async () => {
      //given
      const findBoards: Notice_Board[] = [
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
      mockNoticeBoardRepository.find.mockImplementation(() =>
        Promise.resolve(findBoards),
      );

      //when
      const result = await noticeBoardService.getAllNotice();

      //then
      expect(result.data).toEqual(findBoards);
      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual(
        '공지사항 전체 목록 조회가 완료되었습니다.',
      );
      expect(mockNoticeBoardRepository.find).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardRepository.find).toHaveBeenCalledWith();
    });
    it('공지사항 전체 조회 실패', async () => {
      //given
      mockNoticeBoardRepository.find.mockImplementation(() => []);

      //when
      const result = noticeBoardService.getAllNotice();

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: '공지사항 목록이 없습니다.',
        }),
      );
      expect(mockNoticeBoardRepository.find).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardRepository.find).toHaveBeenCalledWith();
    });
  });

  describe('findNoticeById', () => {
    it('공지사항 조회 성공', async () => {
      //given
      const findBoard: Notice_Board = {
        id: '1',
        user_id: '사용자',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      mockNoticeBoardRepository.findOne.mockImplementation(
        (board_id) => findBoard,
      );

      //when
      const board_id = '1';

      const result = await noticeBoardService.findNoticeById(board_id);

      //then
      expect(result).toEqual(findBoard);
      expect(mockNoticeBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: board_id },
      });
    });
    it('공지사항 조회 실패', async () => {
      //given
      mockNoticeBoardRepository.findOne.mockImplementation(() => null);

      //when
      const board_id = '';

      const result = noticeBoardService.findNoticeById(board_id);

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: 'Not Found Notice_Board ID',
        }),
      );
      expect(mockNoticeBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: board_id },
      });
    });
  });

  describe('detailNotice', () => {
    it('단일 공지사항 조회 성공', async () => {
      //given
      const findBoard: Notice_Board = {
        id: '1',
        user_id: 'user',
        title: '제목',
        content: '내용',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const mockNoticeBoardService = jest
        .spyOn(noticeBoardService, 'findNoticeById')
        .mockResolvedValue(findBoard);

      //when
      const board_id = '1';

      const result = await noticeBoardService.detailNotice(board_id);

      //then
      expect(result.data).toEqual(findBoard);
      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual(
        '공지사항이 게시글 조회가 완료되었습니다.',
      );
      expect(mockNoticeBoardService).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardService).toHaveBeenCalledWith(board_id);
    });
  });
});
