import { Controller, Get, Param, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    getProfile(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.userService.findAll(paginationDto);
    }

    // TODO: Ban account
}
