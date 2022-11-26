import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
    lastUpdated;

    @ManyToOne(() => User, (user) => user.posts)
    user: User;
}
