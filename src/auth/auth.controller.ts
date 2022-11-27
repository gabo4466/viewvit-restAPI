import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    SetMetadata,
    Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators';
import { GetUser } from './decorators/get-user.decorator';
import { LoginUserDto, CreateUserDto, UpdateAccountDto } from './dto';
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

    @Patch()
    @Auth()
    updateAccount(
        @Body() updateAccountDto: UpdateAccountDto,
        @GetUser() user: User,
    ) {
        return this.authService.updateAccount(updateAccountDto, user);
    }

    // TODO: Get info logged account
    @Get()
    @Auth()
    getAccount(@GetUser() user: User) {}

    // TODO: Deactivate account
    @Get()
    @Auth()
    deactivateAccount(@GetUser() user: User) {}
}
