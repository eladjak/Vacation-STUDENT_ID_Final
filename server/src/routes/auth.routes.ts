import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateLogin, validateRegister } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const authController = new AuthController();

// Login route
router.post(
  '/login',
  validateLogin,
  validate,
  asyncHandler(authController.login)
);

// Register route
router.post(
  '/register',
  validateRegister,
  validate,
  asyncHandler(authController.register)
);

// Get current user
router.get(
  '/me',
  asyncHandler(authController.getCurrentUser)
);

export default router; 