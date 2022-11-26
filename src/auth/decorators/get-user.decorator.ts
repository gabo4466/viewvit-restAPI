import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getResponse();
        const user = request.user;
        if (!user) {
            throw new InternalServerErrorException('Something went wrong');
        }
        return !data ? user : user[data];
    },
);
