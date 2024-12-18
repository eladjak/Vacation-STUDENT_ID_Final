/**
 * Main entry point for the Vacation Management System server application.
 * This file initializes the Express server, sets up middleware, connects to the database,
 * and starts the server listening for requests.
 * 
 * The server provides REST API endpoints for:
 * - User authentication and authorization
 * - Vacation management (CRUD operations)
 * - File uploads for vacation images
 */

import 'reflect-metadata';  // Required for TypeORM decorators
import express from 'express';
import cors from 'cors';
import path from 'path';
import { AppDataSource } from './config/data-source';
import authRoutes from './routes/auth.routes';
import vacationRoutes from './routes/vacation.routes';
import { auth } from './middleware/auth';
import { seedDatabase } from './data/seed';

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for client-server communication
app.use(cors());

// Parse incoming JSON payloads in request bodies
app.use(express.json());

/**
 * Serve static files from the uploads directory
 * This allows clients to access uploaded vacation images through direct URLs
 */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

/**
 * Health check endpoint
 * Used by monitoring systems and load balancers to verify server status
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/**
 * API Routes Configuration
 * - /api/v1/auth: Authentication endpoints (login, register)
 * - /api/v1/vacations: Protected vacation management endpoints
 */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vacations', auth, vacationRoutes);

// Initialize database connection and start server
AppDataSource.initialize()
  .then(async () => {
    console.log('Database connection initialized successfully');

    /**
     * Seed the database with initial demo data
     * This includes creating default users and sample vacations
     */
    try {
      await seedDatabase();
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }

    // Start the Express server on the specified port
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database connection:', error);
  }); 