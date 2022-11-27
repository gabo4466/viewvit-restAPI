import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class PostsService {
    private readonly logger = new Logger('PostsService');

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {}

    async create(createPostDto: CreatePostDto, user: User) {
        try {
            const { ...postDetails } = createPostDto;

            const product = this.postRepository.create({
                ...postDetails,
                user,
            });

            await this.postRepository.save(product);

            return { ...product };
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findAll(paginationDto: PaginationDto) {
        const { limit = 10, offset = 0, term } = paginationDto;

        let posts: Post[];

        if (!term) {
            posts = await this.postRepository.find({
                take: limit,
                skip: offset,
                where: { isDeleted: false },
            });
        } else {
            posts = await this.postRepository.find({
                take: limit,
                skip: offset,
                where: { isDeleted: false, subject: term },
            });
        }

        if (!posts.length && !term) {
            throw new NotFoundException(`Posts not found`);
        } else if (!posts.length && term) {
            throw new NotFoundException(
                `Posts with subject: "${term}" not found`,
            );
        }

        return posts.map((post) => ({
            ...post,
        }));
    }

    async findOne(id: string) {
        let post: Post;

        if (!isUUID(id)) {
            throw new BadRequestException(`Id: "${id}" must be an UUID`);
        }

        post = await this.postRepository.findOneBy({ id_post: id });

        if (!post) {
            throw new NotFoundException(`Post with id: "${id}" not found`);
        }

        return post;
    }

    // TODO: Update content
    update(id: number, updatePostDto: UpdatePostDto) {
        return `This action updates a #${id} post`;
    }

    // TODO: Delete post with attribute isDeleted
    remove(id: number) {
        return `This action removes a #${id} post`;
    }

    private handleDBExceptions(error: any) {
        if (error.code === '23505') {
            throw new BadRequestException(error.detail);
        }

        this.logger.error(error);
        throw new InternalServerErrorException(
            'Unexpected error, check server logs',
        );
    }
}
