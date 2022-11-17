import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id_user: string;

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

    @Column('boolean')
    banned: boolean;
}
