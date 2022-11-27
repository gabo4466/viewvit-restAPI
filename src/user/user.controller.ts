import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // TODO: Get profile by UUID
    @Get(':id')
    getProfile(@Param('id') id: string) {}

    // TODO: Update profile endpoint

    // TODO: Get all && Search

    // TODO: Deactivate account

    // TODO: Ban account
}
