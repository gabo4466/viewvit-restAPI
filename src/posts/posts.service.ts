import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { User } from 'src/auth/entities/user.entity';

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

    findAll() {
        return `This action returns all posts`;
    }

    findOne(id: number) {
        return `This action returns a #${id} post`;
    }

    update(id: number, updatePostDto: UpdatePostDto) {
        return `This action updates a #${id} post`;
    }

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
