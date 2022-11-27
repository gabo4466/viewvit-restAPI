import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { PostsModule } from '../posts/posts.module';

@Module({
    controllers: [CommentsController],
    providers: [CommentsService],
    imports: [TypeOrmModule.forFeature([Comment]), AuthModule, PostsModule],
    exports: [TypeOrmModule],
})
export class CommentsModule {}
