import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoticeSaveDto } from './dto/notice_board.save';
import { Notice_Board } from './entities/notice_board.entity';

@Injectable()
export class NoticeBoardService {
  constructor(
    @InjectRepository(Notice_Board)
    private readonly noticeBoardRepository: Repository<Notice_Board>,
  ) {}

  async getAll() {
    try {
      const notices = await this.noticeBoardRepository.find();
      console.log(notices);
      return notices;
    } catch (error) {
      return error;
    }
  }

  async save(body: NoticeSaveDto) {
    try {
        const notice = await this.noticeBoardRepository.save(body);
        return { message: 'Save notice' };
    } catch (error) {
      return error;
    }
  }
}
