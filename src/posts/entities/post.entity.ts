import {
    BeforeInsert,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id_post: string;

    @Column('text')
    subject: string;

    @Column('text')
    content: string;

    @Column('date')
    lastUpdated: Date;

    @Column('bool', {
        default: false,
    })
    isDeleted: boolean;

    @ManyToOne(() => User, (user) => user.posts, { eager: true })
    user: User;

    @BeforeInsert()
    nullValues() {
        this.lastUpdated = new Date();
    }
}
