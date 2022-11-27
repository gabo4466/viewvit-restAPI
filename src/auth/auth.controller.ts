import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators';
import { GetUser } from './decorators/get-user.decorator';
import { LoginUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles.enum';

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

    @Get('profile')
    @Auth(ValidRoles.admin)
    getProfile(@GetUser() user: User) {
        return 'hola mundo';
    }
}
