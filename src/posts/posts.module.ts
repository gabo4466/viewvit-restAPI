import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
    controllers: [PostsController],
    providers: [PostsService],
    imports: [TypeOrmModule.forFeature([Post]), AuthModule, CommentsModule],
    exports: [TypeOrmModule],
})
export class PostsModule {}
