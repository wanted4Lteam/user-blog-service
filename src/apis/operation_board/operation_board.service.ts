import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationInputDto } from './dto/operation_board.input';
import { Operation_Board } from './entities/operation_board.entity';

@Injectable()
export class OperationBoardService {
  constructor(
    @InjectRepository(Operation_Board)
    private readonly operationRepository: Repository<Operation_Board>,
  ) {}

  async findOperationById(id: string) {
    try {
      const operation = await this.operationRepository.findOne({
        where: { id },
      });

      if (!operation) {
        throw new NotFoundException(
          Object.assign({
            statusCode: 404,
            message: 'Not Found Operation_Board ID',
          }),
        );
      }
      return operation;
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }

  async saveNotice(operationInputDto: OperationInputDto, user_id: string) {
    try {
      const { title, content } = operationInputDto;

      const operation = this.operationRepository.create({
        title,
        content,
        user_id,
      });
      await this.operationRepository.save(operation);

      return Object.assign({
        data: operation,
        statusCode: 201,
        message: '운영게시판에 등록되었습니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }
}
