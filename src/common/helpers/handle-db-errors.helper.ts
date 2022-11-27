import {
    BadRequestException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
export const handleDBErrors = (error: any, logger: Logger) => {
    if (error.code === '23505') {
        logger.log(error.detail);
        throw new BadRequestException(error.detail);
    } else {
        logger.error(error);
        throw new InternalServerErrorException('Something went wrong');
    }
};
