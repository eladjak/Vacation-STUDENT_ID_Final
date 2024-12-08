import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { AppDataSource } from './config/data-source';
import authRoutes from './routes/auth.routes';
import vacationRoutes from './routes/vacation.routes';
import { auth } from './middleware/auth';
import { seedDatabase } from './data/seed';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vacations', auth, vacationRoutes);

// Initialize database connection
AppDataSource.initialize()
  .then(async () => {
    console.log('Database connection initialized successfully');

    // Seed database with demo data
    try {
      await seedDatabase();
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }

    // Start server
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database connection:', error);
  }); 