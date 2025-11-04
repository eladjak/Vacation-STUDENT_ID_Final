/**
 * Vacation Management Routes
 * 
 * Defines all vacation-related routes including CRUD operations,
 * following functionality, and administrative features.
 * 
 * Base Path: /api/v1/vacations
 */

import { Router, Request } from 'express';
import { VacationController } from '../controllers/vacation.controller';
import { VacationsService } from '../services/vacations.service';
import { IsAdminGuard } from '../middleware/isAdmin';
import { AuthGuard } from '../middleware/auth';
import multer from 'multer';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { initializeDataSource } from '../config/data-source';
import { VacationFollow } from '../entities/vacation-follow.entity';
import { User } from '../entities/user.entity';

// Define custom request interface
interface AuthenticatedRequest extends Request {
  user?: User;
}

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '../../uploads/vacations'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Initialize services and repositories
let vacationsService: VacationsService;
let vacationController: VacationController;

const initializeControllers = async () => {
  const dataSource = await initializeDataSource();
  vacationsService = new VacationsService();
  vacationController = new VacationController(vacationsService);
};

// Initialize controllers
initializeControllers().catch(console.error);

// Apply authentication middleware to all routes
router.use(AuthGuard);

// Routes
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { page = 1, limit = 10, followed, active, upcoming } = req.query;
    const result = await vacationController.findAll(
      req,
      Number(page),
      Number(limit),
      {
        followed: Boolean(followed),
        active: Boolean(active),
        upcoming: Boolean(upcoming)
      }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const vacation = await vacationController.findOne(req.params.id, req.user?.id);
    res.json(vacation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post('/',
  IsAdminGuard,
  upload.array('images', 10),
  async (req: AuthenticatedRequest, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const vacation = await vacationController.create(req.body, files);
      res.status(201).json(vacation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put('/:id',
  IsAdminGuard,
  upload.array('images', 10),
  async (req: AuthenticatedRequest, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const vacation = await vacationController.update(req.params.id, req.body, files);
      res.json(vacation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete('/:id', IsAdminGuard, async (req: AuthenticatedRequest, res) => {
  try {
    await vacationController.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/follow', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const result = await vacationController.follow(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id/follow', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const result = await vacationController.unfollow(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/stats/followers', IsAdminGuard, async (req: AuthenticatedRequest, res) => {
  try {
    const stats = await vacationController.getFollowersStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 