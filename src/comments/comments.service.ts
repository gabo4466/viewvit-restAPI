import {
    Injectable,
    Logger,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostsService } from 'src/posts/posts.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../auth/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { handleDBErrors } from 'src/common/helpers/handle-db-errors.helper';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CommentsService {
    private readonly logger = new Logger('PostsService');
    constructor(
        private readonly postsService: PostsService,
        @InjectRepository(Comment)
        private readonly commentsRepository: Repository<Comment>,
    ) {}

    async create(
        createCommentDto: CreateCommentDto,
        user: User,
        id_post: string,
    ) {
        try {
            const { ...commentData } = createCommentDto;
            const post = await this.postsService.findOne(id_post);
            const comment = await this.commentsRepository.create({
                ...commentData,
                user,
                post,
            });

            await this.commentsRepository.save(comment);
            return { comment };
        } catch (error) {
            handleDBErrors(error, this.logger);
        }

        return 'This action adds a new comment';
    }

    async findOne(id: string) {
        let comment: Comment;
        if (!isUUID(id)) {
            throw new BadRequestException(`Id: "${id}" must be an UUID`);
        }

        comment = await this.commentsRepository.findOne({
            where: { id_comment: id },
        });

        if (!comment) {
            throw new NotFoundException(`Comment with id: "${id}" not found`);
        }

        return comment;
    }

    findAll() {
        return `This action returns all comments`;
    }

    async remove(id: string) {
        return `This action removes a #${id} comment`;
    }
}
