import { Router } from 'express';
import { VacationController } from '../controllers/vacation.controller';
import { validateVacation } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import { upload } from '../middleware/upload';

const router = Router();
const vacationController = new VacationController();

// Get all vacations (with pagination and filters)
router.get('/', auth, asyncHandler(vacationController.getAll));

// Get single vacation
router.get('/:id', auth, asyncHandler(vacationController.getOne));

// Create new vacation (admin only)
router.post(
  '/',
  auth,
  isAdmin,
  upload.single('image'),
  validateVacation,
  validate,
  asyncHandler(vacationController.create)
);

// Update vacation (admin only)
router.put(
  '/:id',
  auth,
  isAdmin,
  upload.single('image'),
  validateVacation,
  validate,
  asyncHandler(vacationController.update)
);

// Delete vacation (admin only)
router.delete('/:id', auth, isAdmin, asyncHandler(vacationController.delete));

// Follow vacation
router.post('/:id/follow', auth, asyncHandler(vacationController.follow));

// Unfollow vacation
router.delete('/:id/follow', auth, asyncHandler(vacationController.unfollow));

// Get vacation statistics (admin only)
router.get('/stats/followers', auth, isAdmin, asyncHandler(vacationController.getFollowersStats));

// Export vacations to CSV (admin only)
router.get('/export/csv', auth, isAdmin, asyncHandler(vacationController.exportToCsv));

export default router; 