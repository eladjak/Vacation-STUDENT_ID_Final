import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/vacations');
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `vacation-${uniqueSuffix}${ext}`);
  }
});

// File filter for image types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    logger.info('Valid image file uploaded', {
      filename: file.originalname,
      mimetype: file.mimetype
    });
    cb(null, true);
  } else {
    logger.warn('Invalid file type attempted to upload', {
      filename: file.originalname,
      mimetype: file.mimetype
    });
    cb(new AppError(400, 'Only image files are allowed'));
  }
};

// Configure multer upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1 // Maximum 1 file per request
  }
});

// Error handling middleware for multer errors
export const handleMulterError = (error: any, req: Request) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        logger.warn('File size limit exceeded', { error: error.message });
        return new AppError(400, 'File size cannot exceed 5MB');
      case 'LIMIT_FILE_COUNT':
        logger.warn('File count limit exceeded', { error: error.message });
        return new AppError(400, 'Cannot upload more than 1 file');
      default:
        logger.error('Multer error occurred', { error: error.message });
        return new AppError(400, 'File upload error occurred');
    }
  }
  return error;
}; 