import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    getProfile(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    // TODO: Update profile endpoint

    // TODO: Get all && Search

    // TODO: Deactivate account

    // TODO: Ban account

    // TODO: Account settings
}
