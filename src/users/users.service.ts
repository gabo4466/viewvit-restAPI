import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly logger = new Logger('ProductsService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const { ...userData } = createUserDto;
            const user = this.userRepository.create({
                ...userData,
            });

            await this.userRepository.save(user);

            return { ...user };
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    private handleDBExceptions(error: any) {
        if (error.code === '23505') throw new BadRequestException(error.detail);

        this.logger.error(error);
        // console.log(error)
        throw new InternalServerErrorException(
            'Unexpected error, check server logs',
        );
    }
}
