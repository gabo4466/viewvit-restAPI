import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { isUUID } from 'class-validator';
import { UnauthorizedException } from '@nestjs/common';
import { handleDBErrors } from 'src/common/helpers/handle-db-errors.helper';

@Injectable()
export class PostsService {
    private readonly logger = new Logger('PostsService');

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly dataSource: DataSource,
    ) {}

    async create(createPostDto: CreatePostDto, user: User) {
        try {
            const { ...postDetails } = createPostDto;

            const post = this.postRepository.create({
                ...postDetails,
                user,
            });

            await this.postRepository.save(post);

            return { ...post };
        } catch (error) {
            handleDBErrors(error, this.logger);
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
                relationLoadStrategy: 'join',
                relations: {
                    user: true,
                },
            });
        } else {
            const queryBuilder = this.postRepository.createQueryBuilder('post');
            posts = await queryBuilder
                .where('LOWER(subject) like :subject', {
                    subject: `%${term.toLowerCase()}%`,
                })
                .andWhere('post.isDeleted =:isDeleted', {
                    isDeleted: false,
                })
                .leftJoinAndSelect('post.user', 'postUser')
                .take(limit)
                .skip(offset)
                .getMany();
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

    async update(id: string, user: User, updatePostDto: UpdatePostDto) {
        let post: Post = await this.findOne(id);

        const postUpdate = { id_post: post.id_post, ...updatePostDto };

        if (post.user.id_user != user.id_user) {
            throw new UnauthorizedException(
                `You are not the owner of this post`,
            );
        }

        const postToUpdate = await this.postRepository.preload(postUpdate);

        if (!postToUpdate) {
            throw new InternalServerErrorException(`Something went wrong`);
        }
        return await this.updatePostTransaction(postToUpdate);
    }

    async remove(id: string, user: User) {
        let post: Post = await this.findOne(id);

        if (
            post.user.id_user != user.id_user &&
            !user.roles.includes('admin')
        ) {
            throw new UnauthorizedException(`You cannot delete this post`);
        }

        post.isDeleted = true;

        return await this.updatePostTransaction(post);
    }

    async getUserPosts(idUser: string, paginationDto: PaginationDto) {
        const { limit = 10, offset = 0, term } = paginationDto;

        let posts: Post[];

        if (!isUUID(idUser)) {
            throw new BadRequestException(`Id: "${idUser}" must be an UUID`);
        }

        const queryBuilder = this.postRepository.createQueryBuilder('post');
        posts = await queryBuilder
            .where('post.isDeleted =:isDeleted', {
                isDeleted: false,
            })
            .andWhere('post.user.id_user =:id_user', {
                id_user: idUser,
            })
            .take(limit)
            .skip(offset)
            .getMany();

        return posts.map((post) => ({
            ...post,
        }));
    }

    private async updatePostTransaction(post: Post) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(post);
            await queryRunner.commitTransaction();
            await queryRunner.release();

            return { post };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            handleDBErrors(error, this.logger);
        }
    }
}
