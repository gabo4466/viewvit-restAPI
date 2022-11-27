import { Injectable, Logger } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/common/helpers/handle-db-errors.helper';

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

    findAll() {
        return `This action returns all comments`;
    }

    findOne(id: number) {
        return `This action returns a #${id} comment`;
    }

    remove(id: number) {
        return `This action removes a #${id} comment`;
    }
}
