import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { AppDataSource } from './config/data-source';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import path from 'path';

import authRoutes from './routes/auth.routes';
import vacationRoutes from './routes/vacation.routes';
import userRoutes from './routes/user.routes';

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
const vacationsUploadsDir = path.join(uploadsDir, 'vacations');

if (!require('fs').existsSync(uploadsDir)) {
  require('fs').mkdirSync(uploadsDir);
}
if (!require('fs').existsSync(vacationsUploadsDir)) {
  require('fs').mkdirSync(vacationsUploadsDir);
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vacations', vacationRoutes);
app.use('/api/v1/users', userRoutes);

// Error handling
app.use(errorHandler);

// Database connection and server startup
const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Static files are served from: ${path.join(__dirname, '..', 'uploads')}`);
    });
  })
  .catch((error) => {
    logger.error('Database connection error:', error);
    process.exit(1);
  }); 