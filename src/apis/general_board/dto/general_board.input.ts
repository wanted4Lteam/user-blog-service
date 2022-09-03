import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GeneralInputDto {
  @ApiProperty({ example: '자유게시판', required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: '모두가 이용할 수 있는 자유게시판입니다.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
