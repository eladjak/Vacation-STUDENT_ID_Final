/**
 * File Upload Middleware
 * 
 * Configures and exports a Multer middleware instance for handling
 * vacation image uploads. Implements security measures and
 * file validation to ensure safe and consistent file storage.
 * 
 * Features:
 * - Secure file naming with unique identifiers
 * - Image file type validation
 * - File size limits
 * - Organized storage structure
 */

import multer from 'multer';
import path from 'path';

/**
 * Storage Configuration
 * 
 * Configures how and where uploaded files are stored:
 * - Destination: /uploads/vacations directory
 * - Filename: Timestamp + random number + original extension
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/vacations'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

/**
 * File Filter
 * 
 * Validates uploaded files:
 * - Accepts only image files (jpg, jpeg, png, gif)
 * - Rejects all other file types
 * 
 * @param req - Express request object
 * @param file - Uploaded file information
 * @param cb - Callback to accept/reject file
 */
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('רק קבצי תמונה מותרים!'));
  }
  cb(null, true);
};

/**
 * Multer Configuration
 * 
 * Exports configured Multer middleware with:
 * - Custom storage configuration
 * - File type filtering
 * - 5MB file size limit
 */
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
}); 