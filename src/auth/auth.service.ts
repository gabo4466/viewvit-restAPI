import {
    Injectable,
    InternalServerErrorException,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto, UpdateAccountDto } from './dto';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { handleDBErrors } from 'src/common/helpers/handle-db-errors.helper';

@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly dataSource: DataSource,
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
            handleDBErrors(error, this.logger);
        }
    }

    async login(loginUserDto: LoginUserDto) {
        const { password, email } = loginUserDto;
        const user = await this.userRepository.findOne({
            where: { email },
            select: {
                email: true,
                password: true,
                isActive: true,
                isBanned: true,
                id_user: true,
            },
        });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException('Credentials are not valid');
        }

        if (user.isBanned) {
            throw new UnauthorizedException({
                code: '0001',
                msg: `The account is banned`,
            });
        }

        if (!user.isActive) {
            throw new UnauthorizedException({
                code: '0002',
                msg: `The account is deactivated`,
            });
        }

        return {
            ...user,
            token: this.getJwtToken({
                id_user: user.id_user,
            }),
        };
    }

    async updateAccount(updateAccountDto: UpdateAccountDto, user: User) {
        let userUpdate = {
            id_user: user.id_user,
            ...updateAccountDto,
        };

        if (userUpdate.password) {
            userUpdate.password = bcrypt.hashSync(userUpdate.password, 10);
        }

        console.log({ userUpdate });

        const userToUpdate = await this.userRepository.preload(userUpdate);

        if (!userToUpdate) {
            throw new InternalServerErrorException(`Something went wrong`);
        }
        return await this.updateUserTransaction(userToUpdate);
    }

    async getDataAccount(user: User) {
        const userData = await this.userRepository.findOneBy({
            id_user: user.id_user,
        });
        if (!userData) {
            throw new InternalServerErrorException(`Something went wrong`);
        }

        return userData;
    }

    async deactivateAccount(user: User) {
        user.isActive = false;
        return await this.updateUserTransaction(user);
    }

    async updateProfileImage(user: User) {
        return await this.updateUserTransaction(user);
    }

    private async updateUserTransaction(updateUser: object) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(updateUser);
            await queryRunner.commitTransaction();
            await queryRunner.release();

            return { updateUser };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            handleDBErrors(error, this.logger);
        }
    }

    private getJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign(payload);
        return token;
    }
}
