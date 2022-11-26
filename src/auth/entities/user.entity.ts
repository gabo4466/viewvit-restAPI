import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id_user: string;

    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: string[];

    @Column('bool')
    isBanned: boolean;

    @Column('bool')
    isActive: boolean;

    @Column('text')
    name: string;

    @Column('text', { unique: true })
    nickname: string;

    @Column('text')
    password: string;

    @Column('text', { unique: true })
    email: string;

    @Column('date')
    birthday: Date;

    @Column('text')
    profilePhoto: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];
}
