/**
 * Application Configuration Module
 * 
 * This module sets up the Express application with all necessary middleware,
 * security configurations, and route handlers. It provides a robust foundation
 * for the Vacation Management System's server-side operations.
 * 
 * Key Features:
 * - Security middleware (Helmet)
 * - CORS configuration
 * - Request parsing and compression
 * - Static file serving
 * - Logging
 * - Error handling
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { AppDataSource } from './config/data-source';
import { errorHandler } from './middleware/error.middleware';
import vacationRoutes from './routes/vacation.routes';
import authRoutes from './routes/auth.routes';
import { auth } from './middleware/auth';

const app = express();

/**
 * Directory Setup
 * Creates necessary directories for file uploads if they don't exist
 * - uploads/: Main uploads directory
 * - uploads/vacations/: Directory for vacation-related images
 */
const uploadsDir = path.join(__dirname, '..', 'uploads');
const vacationsUploadsDir = path.join(uploadsDir, 'vacations');

if (!require('fs').existsSync(uploadsDir)) {
  require('fs').mkdirSync(uploadsDir);
}
if (!require('fs').existsSync(vacationsUploadsDir)) {
  require('fs').mkdirSync(vacationsUploadsDir);
}

/**
 * Security Configuration
 * Helmet helps secure Express apps by setting various HTTP headers
 */
app.use(helmet());

/**
 * CORS Configuration
 * Enables Cross-Origin Resource Sharing with specific options:
 * - Allows requests only from the configured client URL
 * - Supports credentials
 * - Permits specific HTTP methods
 * - Allows necessary headers
 */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Request Body Parsing
 * Configures Express to parse:
 * - JSON payloads
 * - URL-encoded bodies (extended mode for nested objects)
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Response Compression
 * Compresses response bodies for all requests
 */
app.use(compression());

/**
 * Request Logging
 * Morgan logger for development environment
 * Disabled during testing to keep test output clean
 */
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

/**
 * Cross-Origin Resource Configuration
 * Additional headers to ensure proper resource sharing,
 * particularly important for static files
 */
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

/**
 * Static File Serving Configuration
 * Serves files from the uploads directory with:
 * - CORS headers
 * - Cache control for better performance
 * - Cross-origin resource policy
 */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

/**
 * Routes Initialization Function
 * Sets up API endpoints with their respective middleware:
 * - Authentication routes (public)
 * - Vacation routes (protected by auth middleware)
 */
const initializeRoutes = () => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/vacations', auth, vacationRoutes);
};

/**
 * Global Error Handler
 * Catches and processes all errors thrown in the application
 */
app.use(errorHandler);

// Export app and initialization function
export { app, initializeRoutes }; 