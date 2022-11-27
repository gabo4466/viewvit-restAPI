import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @Auth()
    create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
        return this.postsService.create(createPostDto, user);
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.postsService.findAll(paginationDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Patch(':id')
    @Auth()
    update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @GetUser() user: User,
    ) {
        return this.postsService.update(id, user, updatePostDto);
    }

    @Delete(':id')
    @Auth()
    remove(@Param('id') id: string, @GetUser() user: User) {
        return this.postsService.remove(id, user);
    }

    @Get('userPosts/:idUser')
    getUserPosts(
        @Param('idUser') idUser: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.postsService.getUserPosts(idUser, paginationDto);
    }
}
