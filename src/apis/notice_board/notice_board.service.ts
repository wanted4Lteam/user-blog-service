import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoticeInputDto } from './dto/notice_board.input';
import { Notice_Board } from './entities/notice_board.entity';

@Injectable()
export class NoticeBoardService {
  constructor(
    @InjectRepository(Notice_Board)
    private readonly noticeBoardRepository: Repository<Notice_Board>,
  ) {}

  async findNoticeById(id: string) {
    try {
      const notice = await this.noticeBoardRepository.findOne({
        where: { id },
      });

      if (!notice) {
        throw new NotFoundException(
          Object.assign({
            statusCode: 404,
            message: 'Not Found Notice_Board ID',
          }),
        );
      }
      return notice;
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }

  async getAllNotice() {
    try {
      const noticeList = await this.noticeBoardRepository.find();

      if (noticeList.length === 0) {
        throw new NotFoundException(
          Object.assign({
            statusCode: 404,
            message: '공지사항 목록이 없습니다.',
          }),
        );
      }

      return Object.assign({
        data: noticeList,
        statusCode: 200,
        message: '공지사항 전체 목록 조회가 완료되었습니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }

  async saveNotice(noticeInputDto: NoticeInputDto, user_id: string) {
    try {
      const { title, content } = noticeInputDto;

      const notice = this.noticeBoardRepository.create({
        title,
        content,
        user_id,
      });
      await this.noticeBoardRepository.save(notice);

      return Object.assign({
        data: notice,
        statusCode: 201,
        message: '공지사항이 등록되었습니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }

  async updateNotice(id: string, noticeInputDto: NoticeInputDto) {
    try {
      await this.findNoticeById(id);

      await this.noticeBoardRepository.update(id, noticeInputDto);

      const result = await this.findNoticeById(id);

      return Object.assign({
        data: result,
        statusCode: 200,
        message: '공지사항이 수정되었습니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }

  async deleteNotice(id: string) {
    try {
      await this.findNoticeById(id);

      await this.noticeBoardRepository.softDelete(id);

      return Object.assign({
        statusCode: 200,
        message: '공지사항이 삭제되었습니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }

  async detailNotice(id: string) {
    try {
      const notice = await this.findNoticeById(id);

      if (!notice) {
        throw new NotFoundException(
          Object.assign({
            statusCode: 404,
            message: 'Not Found Notice_Board ID',
          }),
        );
      }

      return Object.assign({
        data: notice,
        statusCode: 200,
        message: '공지사항이 목록 조회가 완료되었습니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }
}
