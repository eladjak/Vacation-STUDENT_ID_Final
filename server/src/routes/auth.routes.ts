import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../middleware/validators';
import { validate } from '../middleware/validate';

const router = Router();
const authController = new AuthController();

// Routes
router.post('/register', validateRegister, validate, authController.register);
router.post('/login', validateLogin, validate, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

export default router; 