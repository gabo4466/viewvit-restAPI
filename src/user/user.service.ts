import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

import { validate as isUUID } from 'uuid';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOne(id: string) {
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
}
