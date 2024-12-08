import { Router } from 'express';
import { VacationController } from '../controllers/vacation.controller';
import { validateVacation } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { isAdmin } from '../middleware/isAdmin';
import { upload } from '../middleware/upload';

const router = Router();
const vacationController = new VacationController();

// Get vacation statistics (admin only)
router.get('/stats/followers', isAdmin, asyncHandler(vacationController.getFollowersStats));

// Export vacations to CSV (admin only)
router.get('/export/csv', isAdmin, asyncHandler(vacationController.exportToCsv));

// Get all vacations (with pagination and filters)
router.get('/', asyncHandler(vacationController.getAll));

// Create new vacation (admin only)
router.post(
  '/',
  isAdmin,
  upload.single('image'),
  validateVacation,
  validate,
  asyncHandler(vacationController.create)
);

// Get single vacation
router.get('/:id', asyncHandler(vacationController.getOne));

// Update vacation (admin only)
router.put(
  '/:id',
  isAdmin,
  upload.single('image'),
  validateVacation,
  validate,
  asyncHandler(vacationController.update)
);

// Delete vacation (admin only)
router.delete('/:id', isAdmin, asyncHandler(vacationController.delete));

// Follow vacation
router.post('/:id/follow', asyncHandler(vacationController.follow));

// Unfollow vacation
router.delete('/:id/follow', asyncHandler(vacationController.unfollow));

export default router; 