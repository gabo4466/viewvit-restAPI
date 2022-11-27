import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { PostsModule } from 'src/posts/posts.module';

@Module({
    controllers: [CommentsController],
    providers: [CommentsService],
    imports: [TypeOrmModule.forFeature([Comment]), AuthModule, PostsModule],
})
export class CommentsModule {}
