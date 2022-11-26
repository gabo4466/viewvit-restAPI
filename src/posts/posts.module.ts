import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';

@Module({
    controllers: [PostsController],
    providers: [PostsService],
    exports: [TypeOrmModule],
    imports: [TypeOrmModule.forFeature([Post])],
})
export class PostsModule {}
