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
});
