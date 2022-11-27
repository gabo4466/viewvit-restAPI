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
import { UnauthorizedException } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';

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
            relationLoadStrategy: 'join',
            relations: {
                user: true,
            },
        });

        if (!comment) {
            throw new NotFoundException(`Comment with id: "${id}" not found`);
        }
        console.log({ comment });

        return comment;
    }

    async findAll(idPost: string, paginationDto: PaginationDto) {
        const { limit = 15, offset = 0, term } = paginationDto;

        let comments: Comment[];

        if (!isUUID(idPost)) {
            throw new BadRequestException(`Id: "${idPost}" must be an UUID`);
        }

        const queryBuilder =
            this.commentsRepository.createQueryBuilder('comment');
        comments = await queryBuilder
            .where('comment.post.id_post =:id_post', {
                id_post: idPost,
            })
            .take(limit)
            .skip(offset)
            .getMany();

        if (!comments.length) {
            throw new NotFoundException(`Comments not found`);
        }

        return comments.map((comment) => ({
            ...comment,
        }));
    }

    async remove(id: string, user: User) {
        const comment = await this.findOne(id);
        if (
            comment.user.id_user != user.id_user &&
            !user.roles.includes('admin')
        ) {
            throw new UnauthorizedException(`You cannot delete this post`);
        }
        return await this.commentsRepository.remove(comment);
    }
}
