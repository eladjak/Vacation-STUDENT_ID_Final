import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { logger } from '../utils/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getProfile = async (req: Request, res: Response) => {
    const user = await this.userService.findById(req.user!.id);
    logger.info(`Retrieved profile for user: ${user.id}`);
    res.json(user);
  };

  updateProfile = async (req: Request, res: Response) => {
    const user = await this.userService.updateProfile(req.user!.id, req.body);
    logger.info(`Updated profile for user: ${user.id}`);
    res.json(user);
  };

  changePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    await this.userService.changePassword(
      req.user!.id,
      currentPassword,
      newPassword
    );
    logger.info(`Changed password for user: ${req.user!.id}`);
    res.json({ message: 'Password changed successfully' });
  };

  getFollowedVacations = async (req: Request, res: Response) => {
    const vacations = await this.userService.getFollowedVacations(req.user!.id);
    logger.info(`Retrieved followed vacations for user: ${req.user!.id}`);
    res.json(vacations);
  };
} 