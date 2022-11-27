import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from 'src/auth/decorators';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    getProfile(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    // TODO: Get all && Search

    // TODO: Ban account
}
