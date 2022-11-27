import { User } from 'src/auth/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import {
    BeforeInsert,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id_comment: string;

    @Column('text')
    content: string;

    @Column('date')
    createdOn: Date;

    @ManyToOne(() => User, (user) => user.comments, { eager: false })
    user: User;

    @ManyToOne(() => Post, (post) => post.comments, { eager: false })
    post: Post;

    @BeforeInsert()
    checkDate() {
        this.createdOn = new Date();
    }
}
