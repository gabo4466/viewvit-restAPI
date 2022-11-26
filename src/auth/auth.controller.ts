import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { LoginUserDto, CreateUserDto } from './dto';
import { UserRoleGuard } from './guards/user-role.guard';
import { User } from './entities/user.entity';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

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
    @RoleProtected(ValidRoles.user)
    @UseGuards(AuthGuard(), UserRoleGuard)
    getProfile(@GetUser() user: User) {}
}
