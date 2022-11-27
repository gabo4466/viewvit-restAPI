import {
    Controller,
    Post,
    Body,
    Get,
    Patch,
    Delete,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from 'src/files/helpers';
import { AuthService } from './auth.service';
import { Auth } from './decorators';
import { GetUser } from './decorators/get-user.decorator';
import { LoginUserDto, CreateUserDto, UpdateAccountDto } from './dto';
import { User } from './entities/user.entity';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.create(createUserDto);
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Patch()
    @Auth()
    updateAccount(
        @Body() updateAccountDto: UpdateAccountDto,
        @GetUser() user: User,
    ) {
        return this.authService.updateAccount(updateAccountDto, user);
    }

    @Get()
    @Auth()
    getAccount(@GetUser() user: User) {
        return this.authService.getDataAccount(user);
    }

    @Delete()
    @Auth()
    deactivateAccount(@GetUser() user: User) {
        return this.authService.deactivateAccount(user);
    }

    @Post('image')
    @Auth()
    @UseInterceptors(
        FileInterceptor('file', {
            fileFilter: fileFilter,
            // limits: { fileSize: 1000 }
            storage: diskStorage({
                destination: './static/uploads',
                filename: fileNamer,
            }),
        }),
    )
    async uploadProfileImage(
        @UploadedFile() file: Express.Multer.File,
        @GetUser() user: User,
    ) {
        if (!file) {
            throw new BadRequestException(`Make sure the file is an image`);
        }
        user.profilePhoto = file.filename;
        await this.authService.updateProfileImage(user);
        return {
            msg: `Image uploaded`,
        };
    }
}
