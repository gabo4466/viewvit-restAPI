import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto } from './dto';
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
    @UseGuards(AuthGuard())
    getProfile() {}
}
