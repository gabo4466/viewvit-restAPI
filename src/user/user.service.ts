import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

import { validate as isUUID } from 'uuid';
import { PaginationDto } from '../common/dto/pagination.dto';
import { handleDBErrors } from 'src/common/helpers/handle-db-errors.helper';

@Injectable()
export class UserService {
    private readonly logger = new Logger('AuthService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOne(id: string): Promise<User> {
        let user: User;
        if (!isUUID(id)) {
            throw new BadRequestException(`Id: "${id}" must be an UUID`);
        }

        user = await this.userRepository.findOne({
            where: { id_user: id },
            select: {
                nickname: true,
                name: true,
                birthday: true,
                profilePhoto: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with id: "${id}" not found`);
        }

        return user;
    }

    async findAll(paginationDto: PaginationDto) {
        const { limit = 10, offset = 0, term } = paginationDto;

        let users: User[];

        if (!term) {
            users = await this.userRepository.find({
                take: limit,
                skip: offset,
                where: { isBanned: false, isActive: true },
            });
        } else {
            const queryBuilder = this.userRepository.createQueryBuilder('user');
            users = await queryBuilder
                .where('LOWER(nickname) like :nickname', {
                    nickname: `%${term.toLowerCase()}%`,
                })
                .getMany();
        }

        if (!users.length && !term) {
            throw new NotFoundException(`Users not found`);
        } else if (!users.length && term) {
            throw new NotFoundException(
                `Users with nickname: "${term}" not found`,
            );
        }

        return users.map((user) => ({
            ...user,
        }));
    }

    async banAccount(id: string) {
        const userToDelete = await this.userRepository.preload({ id_user: id });
        userToDelete.isBanned = true;
        try {
            this.userRepository.save(userToDelete);
        } catch (error) {
            handleDBErrors(error, this.logger);
        }
    }
}
