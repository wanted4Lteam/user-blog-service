import { IsNotEmpty, IsString } from "class-validator";

export class NoticeInputDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}