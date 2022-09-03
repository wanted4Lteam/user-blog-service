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

  async saveOperation(operationInputDto: OperationInputDto, user_id: string) {
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

  async getAllOperation() {
    try {
      const OperationList = await this.operationRepository.find();

      if (OperationList.length === 0) {
        throw new NotFoundException(
          Object.assign({
            statusCode: 404,
            message: '운영게시판 목록이 없습니다.',
          }),
        );
      }

      return Object.assign({
        data: OperationList,
        statusCode: 200,
        message: '운영게시판 전체 목록 조회가 완료되었습니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }

  async updateOperation(
    id: string,
    operationInputDto: OperationInputDto,
    user_id: string,
  ) {
    try {
      const operation = await this.findOperationById(id);

      if (operation.user_id !== user_id) {
        return Object.assign({
          statusCode: 401,
          message: '수정 권한이 없습니다.',
        });
      }

      await this.operationRepository.update(id, operationInputDto);

      const result = await this.findOperationById(id);

      return Object.assign({
        data: result,
        statusCode: 200,
        message: '게시글이 수정되었습니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }

  async deleteOperation(id: string, user_id: string) {
    try {
      const operation = await this.findOperationById(id);

      if (operation.user_id !== user_id) {
        return Object.assign({
          statusCode: 401,
          message: '삭제 권한이 없습니다.',
        });
      }

      await this.operationRepository.softDelete(id);

      return Object.assign({
        statusCode: 200,
        message: '게시글이 삭제되었습니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }
}
