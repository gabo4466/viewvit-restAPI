import { IsString, MinLength } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @MinLength(3)
    subject: string;

    @IsString()
    @MinLength(3)
    content: string;
}
