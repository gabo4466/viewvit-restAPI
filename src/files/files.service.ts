import { existsSync } from 'fs';
import { join } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FilesService {
    getUserImage(imageName: string) {
        const path = join(__dirname, '../../static/uploads', imageName);

        if (!existsSync(path)) {
            throw new NotFoundException(
                `No image found with name: "${imageName}"`,
            );
        }
        return path;
    }
}
