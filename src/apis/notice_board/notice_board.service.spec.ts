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
    update: jest.fn(),
    softDelete: jest.fn(),
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
    mockNoticeBoardRepository.update.mockClear();
    mockNoticeBoardRepository.softDelete.mockClear();
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
    it('단일 게시글 조회 실패', async () => {
      //given
      const mockNoticeBoardService = jest
        .spyOn(noticeBoardService, 'findNoticeById')
        .mockResolvedValue(null);

      //when
      const board_id = '';

      const result = noticeBoardService.detailNotice(board_id);

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: 'Not Found Notice_Board ID',
        }),
      );
      expect(mockNoticeBoardService).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardService).toHaveBeenCalledWith(board_id);
    });
  });

  describe('updateNotice', () => {
    it('공지사항 수정 성공', async () => {
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

      const updateBoard: Notice_Board = {
        id: '1',
        user_id: 'user',
        title: '제목 수정',
        content: '내용 수정',
        createdAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
        user: null,
      };

      const mockNoticeBoardService = jest
        .spyOn(noticeBoardService, 'findNoticeById')
        .mockResolvedValueOnce(findBoard)
        .mockResolvedValueOnce(updateBoard);

      mockNoticeBoardRepository.update.mockImplementation((id, input) =>
        Promise.resolve(updateBoard),
      );

      //when
      const board_id = '1';
      const user_id = 'user';
      const input: NoticeInputDto = {
        title: '제목 수정',
        content: '내용 수정',
      };

      const result = await noticeBoardService.updateNotice(
        board_id,
        input,
        user_id,
      );

      //then
      expect(result.data).toEqual(updateBoard);
      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual('게시글이 수정되었습니다.');
      expect(mockNoticeBoardService).toHaveBeenCalledTimes(2);
      expect(mockNoticeBoardService).toHaveBeenCalledWith(board_id);
    });
    it('공지사항 수정 권한 없음', async () => {
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
        .mockResolvedValueOnce(findBoard);

      mockNoticeBoardRepository.update.mockImplementation((id, input) =>
        Promise.resolve(findBoard),
      );

      //when
      const board_id = '1';
      const user_id = 'another user';
      const input: NoticeInputDto = {
        title: '제목 수정',
        content: '내용 수정',
      };

      const result = await noticeBoardService.updateNotice(
        board_id,
        input,
        user_id,
      );

      //then
      expect(result).toEqual({
        statusCode: 401,
        message: '수정 권한이 없습니다.',
      });
      expect(mockNoticeBoardService).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardService).toHaveBeenCalledWith(board_id);
    });
    it('존재하지 않는 공지사항 수정', async () => {
      //given
      const findBoard: Notice_Board = null;

      const mockNoticeBoardService = jest
        .spyOn(noticeBoardService, 'findNoticeById')
        .mockRejectedValue(
          new NotFoundException({
            statusCode: 404,
            message: 'Not Found Notice_Board ID',
          }),
        );

      //when
      const board_id = '';
      const user_id = 'user';
      const input: NoticeInputDto = {
        title: '제목 수정',
        content: '내용 수정',
      };

      const result = noticeBoardService.updateNotice(board_id, input, user_id);

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: 'Not Found Notice_Board ID',
        }),
      );
      expect(mockNoticeBoardService).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardService).toHaveBeenCalledWith(board_id);
    });
  });

  describe('deleteNotice', () => {
    it('공지사항 삭제 성공', async () => {
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
        .mockResolvedValueOnce(findBoard);

      mockNoticeBoardRepository.softDelete.mockImplementation((board_id) => {
        Promise.resolve({
          generatedMaps: [],
          raw: [],
          affected: 1,
        });
      });

      //when
      const board_id = '';
      const user_id = 'user';

      const result = await noticeBoardService.deleteNotice(board_id, user_id);

      //then
      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual('게시글이 삭제되었습니다.');
      expect(mockNoticeBoardService).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardService).toHaveBeenCalledWith(board_id);
      expect(mockNoticeBoardRepository.softDelete).toHaveBeenCalledTimes(1);
    });
    it('공지사항 삭제 권한 없음', async () => {
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
        .mockResolvedValueOnce(findBoard);

      mockNoticeBoardRepository.softDelete.mockImplementation((board_id) => {
        Promise.resolve({
          generatedMaps: [],
          raw: [],
          affected: 0,
        });
      });

      //when
      const board_id = '1';
      const user_id = 'another user';

      const result = await noticeBoardService.deleteNotice(board_id, user_id);

      //then
      expect(result.statusCode).toEqual(401);
      expect(result.message).toEqual('삭제 권한이 없습니다.');
      expect(mockNoticeBoardService).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardRepository.softDelete).toHaveBeenCalledTimes(0);
    });
    it('존재하지 않는 공지사항 삭제', async () => {
      //given
      const findBoard: Notice_Board = null;

      const mockNoticeBoardService = jest
        .spyOn(noticeBoardService, 'findNoticeById')
        .mockRejectedValue(
          new NotFoundException({
            statusCode: 404,
            message: 'Not Found Notice_Board ID',
          }),
        );

      mockNoticeBoardRepository.softDelete.mockImplementation((board_id) => {
        Promise.resolve({
          generatedMaps: [],
          raw: [],
          affected: 0,
        });
      });

      //when
      const board_id = '';
      const user_id = 'user';

      const result = noticeBoardService.deleteNotice(board_id, user_id);

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException({
          statusCode: 404,
          message: 'Not Found Notice_Board ID',
        }),
      );
      expect(mockNoticeBoardService).toHaveBeenCalledTimes(1);
      expect(mockNoticeBoardRepository.softDelete).toHaveBeenCalledTimes(0);
    });
  });
});
