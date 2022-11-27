import { Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UpdateAccountDto {
    @IsString()
    @MinLength(2)
    @IsOptional()
    name: string;

    @IsString()
    @MinLength(4)
    @IsOptional()
    nickname: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'The password must have a Uppercase, lowercase letter and a number',
    })
    @IsOptional()
    password: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email: string;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    birthday: Date;
}
