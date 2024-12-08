import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUpdateProfile, validateChangePassword } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Get user profile
router.get('/profile', auth, asyncHandler(userController.getProfile));

// Update user profile
router.put(
  '/profile',
  auth,
  validateUpdateProfile,
  validate,
  asyncHandler(userController.updateProfile)
);

// Change password
router.put(
  '/password',
  auth,
  validateChangePassword,
  validate,
  asyncHandler(userController.changePassword)
);

// Get followed vacations
router.get('/vacations/followed', auth, asyncHandler(userController.getFollowedVacations));

export default router; 