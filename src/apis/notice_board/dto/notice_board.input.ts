import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class NoticeInputDto {
    @ApiProperty({ example: '오늘의 공지사항', required: true })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: '오늘 하루도 화이팅', required: true })
    @IsNotEmpty()
    @IsString()
    content: string;
}