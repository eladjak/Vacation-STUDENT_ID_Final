import { Request, Response } from 'express';
import { VacationService } from '../services/vacation.service';
import { logger } from '../utils/logger';
import path from 'path';

export class VacationController {
  private vacationService: VacationService;

  constructor() {
    this.vacationService = new VacationService();
  }

  getAll = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = {
      followed: req.query.followed === 'true',
      active: req.query.active === 'true',
      upcoming: req.query.upcoming === 'true'
    };

    const { vacations, total } = await this.vacationService.getAllVacations(
      req.user!.id,
      page,
      limit,
      filters
    );

    const transformedVacations = vacations.map(vacation => ({
      ...vacation,
      imageUrl: vacation.imageUrl ? `/uploads/vacations/${path.basename(vacation.imageUrl)}` : null
    }));

    logger.info(`Retrieved vacations list for user: ${req.user!.id}`);
    res.json({
      vacations: transformedVacations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  };

  getOne = async (req: Request, res: Response) => {
    const vacation = await this.vacationService.getVacationById(
      parseInt(req.params.id)
    );

    const transformedVacation = {
      ...vacation,
      imageUrl: vacation.imageUrl ? `/uploads/vacations/${path.basename(vacation.imageUrl)}` : null
    };

    logger.info(`Retrieved vacation details: ${vacation.id}`);
    res.json(transformedVacation);
  };

  create = async (req: Request, res: Response) => {
    const imageUrl = req.file ? `/uploads/vacations/${req.file.filename}` : undefined;
    const vacation = await this.vacationService.createVacation({
      ...req.body,
      imageUrl
    });
    logger.info(`Created new vacation: ${vacation.id}`);
    res.status(201).json(vacation);
  };

  update = async (req: Request, res: Response) => {
    const imageUrl = req.file ? `/uploads/vacations/${req.file.filename}` : undefined;
    const vacation = await this.vacationService.updateVacation(
      parseInt(req.params.id),
      {
        ...req.body,
        ...(imageUrl && { imageUrl })
      }
    );
    logger.info(`Updated vacation: ${vacation.id}`);
    res.json(vacation);
  };

  delete = async (req: Request, res: Response) => {
    await this.vacationService.deleteVacation(parseInt(req.params.id));
    logger.info(`Deleted vacation: ${req.params.id}`);
    res.status(204).send();
  };

  follow = async (req: Request, res: Response) => {
    await this.vacationService.followVacation(
      parseInt(req.params.id),
      req.user!.id
    );
    logger.info(`User ${req.user!.id} followed vacation ${req.params.id}`);
    res.status(204).send();
  };

  unfollow = async (req: Request, res: Response) => {
    await this.vacationService.unfollowVacation(
      parseInt(req.params.id),
      req.user!.id
    );
    logger.info(`User ${req.user!.id} unfollowed vacation ${req.params.id}`);
    res.status(204).send();
  };

  getFollowersStats = async (req: Request, res: Response) => {
    const stats = await this.vacationService.getFollowersStats();
    logger.info('Retrieved vacation followers statistics');
    res.json(stats);
  };

  exportToCsv = async (req: Request, res: Response) => {
    const filePath = await this.vacationService.exportToCsv();
    logger.info('Exported vacation statistics to CSV');
    res.download(filePath);
  };
} 