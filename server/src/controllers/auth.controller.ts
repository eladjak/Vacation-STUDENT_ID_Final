import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { logger } from '../utils/logger';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    res.status(201).json(result);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);
    
    try {
      const result = await this.authService.login(email, password);
      logger.info(`Login successful for user: ${email}`);
      res.json(result);
    } catch (error) {
      logger.error(`Login failed for user: ${email}`, { error });
      throw error;
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    const token = await this.authService.refreshToken(userId);
    res.json({ token });
  };

  logout = async (req: Request, res: Response) => {
    // In a real application, you might want to invalidate the token here
    logger.info(`User logged out: ${req.user!.id}`);
    res.json({ message: 'Logged out successfully' });
  };
} 