import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { errorHandler } from './middleware/error.middleware';
import { vacationRoutes } from './routes/vacation.routes';
import { authRoutes } from './routes/auth.routes';
import { verifyToken } from './middleware/auth.middleware';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
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

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Set character encoding
app.use((req, res, next) => {
  res.charset = 'utf-8';
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vacations', verifyToken, vacationRoutes);

// Error handling
app.use(errorHandler);

export default app; 