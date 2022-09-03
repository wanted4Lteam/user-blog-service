import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneralInputDto } from './dto/general_board.input';
import { General_Board } from './entities/general_board.entity';

@Injectable()
export class GeneralBoardService {
  constructor(
    @InjectRepository(General_Board)
    private readonly generalBoardRepository: Repository<General_Board>,
  ) {}

  async findGeneralById(id: string) {
    try {
      const general = await this.generalBoardRepository.findOne({
        where: { id },
      });

      if (!general) {
        throw new NotFoundException(
          Object.assign({
            statusCode: 404,
            message: 'Not Found General_Board ID',
          }),
        );
      }
      return general;
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }

  async saveGeneral(generalInputDto: GeneralInputDto, user_id: string) {
    try {
      const { title, content } = generalInputDto;

      const general = this.generalBoardRepository.create({
        title,
        content,
        user_id,
      });
      await this.generalBoardRepository.save(general);

      return Object.assign({
        data: general,
        statusCode: 201,
        message: '자유게시판 게시글이 등록되었습니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }
}
