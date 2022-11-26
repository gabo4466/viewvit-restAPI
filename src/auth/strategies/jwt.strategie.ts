import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { nickname, name, id_user, email } = payload;
        const user = await this.userRepository.findOneBy({ id_user });

        if (!user) {
            throw new UnauthorizedException('Token not valid');
        }
        if (!user.isActive) {
            throw new UnauthorizedException('User is not active');
        }
        if (user.isBanned) {
            throw new UnauthorizedException('User is banned');
        }

        return user;
    }
}
