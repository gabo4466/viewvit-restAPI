import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get('users/:imageName')
    findAll(@Res() res: Response, @Param('imageName') imageName: string) {
        const path = this.filesService.getUserImage(imageName);

        res.sendFile(path);
    }
}
