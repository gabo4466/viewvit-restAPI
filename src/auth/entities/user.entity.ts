import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id_user: string;

    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: string[];

    @Column('bool', {
        default: false,
    })
    isBanned: boolean;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @Column('text')
    name: string;

    @Column('text', { unique: true })
    nickname: string;

    @Column('text', {
        select: false,
    })
    password: string;

    @Column('text', { unique: true })
    email: string;

    @Column('date')
    birthday: Date;

    @Column('text', {
        default: 'defaultProfile.png',
    })
    profilePhoto: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment)
    comments: Comment[];

    @BeforeInsert()
    @BeforeUpdate()
    checkFields() {
        if (this.email) {
            this.email = this.email.toLowerCase().trim();
        }
    }
}
