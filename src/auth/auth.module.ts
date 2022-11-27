import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategie';
import { User } from './entities/user.entity';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    imports: [
        TypeOrmModule.forFeature([User]),

        PassportModule.register({
            defaultStrategy: 'jwt',
        }),

        JwtModule.registerAsync({
            imports: [],
            inject: [],
            useFactory: () => {
                return {
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: '12h',
                    },
                };
            },
        }),
    ],
    exports: [
        TypeOrmModule,
        JwtStrategy,
        PassportModule,
        JwtModule,
        PostsModule,
        CommentsModule,
    ],
})
export class AuthModule {}
