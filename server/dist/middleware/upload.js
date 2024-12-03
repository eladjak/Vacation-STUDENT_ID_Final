"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.handleMulterError = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("./errorHandler");
const logger_1 = require("../utils/logger");
// Configure multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/vacations');
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// File filter for image types
const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        logger_1.logger.info('Valid image file uploaded', {
            filename: file.originalname,
            mimetype: file.mimetype
        });
        cb(null, true);
    }
    else {
        logger_1.logger.warn('Invalid file type attempted to upload', {
            filename: file.originalname,
            mimetype: file.mimetype
        });
        cb(new errorHandler_1.AppError(400, 'Only image files are allowed'));
    }
};
// Configure multer upload
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
        files: 1 // Maximum 1 file per request
    }
});
exports.upload = upload;
// Error handling middleware for multer errors
const handleMulterError = (error, req) => {
    if (error instanceof multer_1.default.MulterError) {
        switch (error.code) {
            case 'LIMIT_FILE_SIZE':
                logger_1.logger.warn('File size limit exceeded', { error: error.message });
                return new errorHandler_1.AppError(400, 'File size cannot exceed 5MB');
            case 'LIMIT_FILE_COUNT':
                logger_1.logger.warn('File count limit exceeded', { error: error.message });
                return new errorHandler_1.AppError(400, 'Cannot upload more than 1 file');
            default:
                logger_1.logger.error('Multer error occurred', { error: error.message });
                return new errorHandler_1.AppError(400, 'File upload error occurred');
        }
    }
    return error;
};
exports.handleMulterError = handleMulterError;
//# sourceMappingURL=upload.js.map