import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OperationInputDto {
  @ApiProperty({ example: '운영게시판 제목', required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: '운영자들만 보세요', required: true })
  @IsNotEmpty()
  @IsString()
  content: string;
}
