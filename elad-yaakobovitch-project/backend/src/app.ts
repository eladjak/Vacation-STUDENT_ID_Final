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

// Create required directories
const uploadsDir = path.join(__dirname, '..', 'uploads');
const vacationsUploadsDir = path.join(uploadsDir, 'vacations');

if (!require('fs').existsSync(uploadsDir)) {
  require('fs').mkdirSync(uploadsDir);
}
if (!require('fs').existsSync(vacationsUploadsDir)) {
  require('fs').mkdirSync(vacationsUploadsDir);
}

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Allow cross-origin for static files
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Initialize routes after database connection
const initializeRoutes = () => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/vacations', auth, vacationRoutes);
};

// Error handling
app.use(errorHandler);

// Export app and initialization function
export { app, initializeRoutes }; 