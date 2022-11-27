import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Get,
    Query,
} from '@nestjs/common';
import { Auth, GetUser } from 'src/auth/decorators';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post(':id_post')
    @Auth()
    create(
        @Body() createCommentDto: CreateCommentDto,
        @GetUser() user: User,
        @Param('id_post') id_post: string,
    ) {
        return this.commentsService.create(createCommentDto, user, id_post);
    }

    @Get(':idPost')
    findAll(
        @Param('idPost') idPost: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.commentsService.findAll(idPost, paginationDto);
    }
    // TODO: Delete comment
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.commentsService.remove(id);
    }
}
