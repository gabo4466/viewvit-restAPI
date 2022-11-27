import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto, UpdateAccountDto } from './dto';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto;
            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10),
            });
            await this.userRepository.save(user);
            delete user.password;
            return {
                ...user,
                token: this.getJwtToken({
                    id_user: user.id_user,
                }),
            };
        } catch (error) {
            this.handleDBErrors(error);
        }
    }

    async login(loginUserDto: LoginUserDto) {
        const { password, email } = loginUserDto;
        const user = await this.userRepository.findOne({
            where: { email },
            select: {
                email: true,
                password: true,
                id_user: true,
            },
        });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException('Credentials are not valid');
        }

        return {
            ...user,
            token: this.getJwtToken({
                id_user: user.id_user,
            }),
        };
    }

    async updateAccount(updateAccountDto: UpdateAccountDto, user: User) {}

    private getJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign(payload);
        return token;
    }

    private handleDBErrors(error: any): never {
        if (error.code === '23505') {
            this.logger.log(error.detail);
            throw new BadRequestException(error.detail);
        } else {
            this.logger.error(error);
            throw new InternalServerErrorException('Something went wrong');
        }
    }
}
