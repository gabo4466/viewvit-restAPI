import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
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
    @Delete('ban/:id')
    @Auth(ValidRoles.admin)
    banAccount(@Param('id') id: string) {
        return this.userService.banAccount(id);
    }
}
