import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}

  async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = this.configService.get('UPLOAD_DIR', 'uploads/vacations');
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    // וודא שהתיקייה קיימת
    await fs.mkdir(uploadDir, { recursive: true });
    
    // שמור את הקובץ
    await fs.writeFile(filePath, file.buffer);
    
    return filePath;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }
} 