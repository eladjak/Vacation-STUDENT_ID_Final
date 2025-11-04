/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
export declare class FileService {
    private configService;
    constructor(configService: ConfigService);
    saveFile(file: Express.Multer.File): Promise<string>;
    deleteFile(filePath: string): Promise<void>;
}
