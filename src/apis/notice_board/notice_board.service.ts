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
    const notice = await this.noticeBoardRepository.findOne({ where: { id } });

    if (!notice) {
      throw new NotFoundException('Not Found Notice_Board ID');
    }

    return notice;
  }
  async getAllNotice() {
    try {
      const notices = await this.noticeBoardRepository.find();
      console.log(notices);
      return notices;
    } catch (error) {
      return error;
    }
  }

  async saveNotice(body: NoticeInputDto) {
    try {
      const notice = await this.noticeBoardRepository.save(body);
      return { message: 'Save Notice' };
    } catch (error) {
      return error;
    }
  }

  async updateNotice(id: string, body: NoticeInputDto) {
    try {
      await this.findNoticeById(id);

      await this.noticeBoardRepository.update(id, body);

      return { message: 'Update Notice' };
    } catch (error) {
      return error;
    }
  }

  async deleteNotice(id: string) {
    try {
      await this.findNoticeById(id);

      await this.noticeBoardRepository.delete(id);

      return { message: 'Delete Notice' };
    } catch (error) {
      return error;
    }
  }

  async detailNotice(id: string) {
    try {
      const notice = await this.findNoticeById(id);

      return notice;
    } catch(error) {
      return error;
    }
  }
}
