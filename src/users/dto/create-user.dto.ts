import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(5)
    name: string;

    @IsString()
    @MinLength(3)
    nickname: string;

    @IsString()
    password: string;

    @IsString()
    email: string;

    @Type(() => Date)
    @IsDate()
    birthday: Date;

    @IsString()
    profilePhoto: string;

    @IsBoolean()
    banned: boolean;
}
