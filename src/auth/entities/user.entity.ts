import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
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

    // TODO: Define default profile photo
    @Column('text', {
        default: '',
    })
    profilePhoto: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @BeforeInsert()
    @BeforeUpdate()
    checkFields() {
        this.email = this.email.toLowerCase().trim();
    }
}
