import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class VacationController {
  private vacationRepository: Repository<Vacation>;
  private followRepository: Repository<VacationFollow>;

  constructor() {
    this.vacationRepository = AppDataSource.getRepository(Vacation);
    this.followRepository = AppDataSource.getRepository(VacationFollow);
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      const vacations = await this.vacationRepository
        .createQueryBuilder('vacation')
        .loadRelationCountAndMap(
          'vacation.followersCount',
          'vacation.follows'
        )
        .leftJoinAndSelect('vacation.follows', 'follow', 'follow.userId = :userId', { userId })
        .getMany();

      const vacationsWithFollowStatus = vacations.map(vacation => ({
        ...vacation,
        isFollowing: vacation.follows?.length > 0,
        followersCount: vacation.followersCount || 0
      }));

      res.json({
        status: 'success',
        data: {
          vacations: vacationsWithFollowStatus
        }
      });
    } catch (error) {
      console.error('Error fetching vacations:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בטעינת החופשות'
      });
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const vacation = await this.vacationRepository
        .createQueryBuilder('vacation')
        .loadRelationCountAndMap(
          'vacation.followersCount',
          'vacation.follows'
        )
        .leftJoinAndSelect('vacation.follows', 'follow', 'follow.userId = :userId', { userId })
        .where('vacation.id = :id', { id })
        .getOne();

      if (!vacation) {
        return res.status(404).json({
          status: 'error',
          message: 'החופשה לא נמצאה'
        });
      }

      const vacationWithFollowStatus = {
        ...vacation,
        isFollowing: vacation.follows?.length > 0,
        followersCount: vacation.followersCount || 0
      };

      res.json({
        status: 'success',
        data: {
          vacation: vacationWithFollowStatus
        }
      });
    } catch (error) {
      console.error('Error fetching vacation:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בטעינת החופשה'
      });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const vacationData = req.body;
      const imageFile = req.file;

      if (imageFile) {
        vacationData.imageUrl = `/uploads/vacations/${imageFile.filename}`;
      }

      const vacation = this.vacationRepository.create(vacationData);
      await this.vacationRepository.save(vacation);

      res.status(201).json({
        status: 'success',
        data: {
          vacation: {
            ...vacation,
            followersCount: 0,
            isFollowing: false
          }
        }
      });
    } catch (error) {
      console.error('Error creating vacation:', error);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        status: 'error',
        message: 'שגיאה ביצירת החופשה'
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const vacationData = req.body;
      const imageFile = req.file;

      const vacation = await this.vacationRepository.findOne({ where: { id: Number(id) } });
      if (!vacation) {
        return res.status(404).json({
          status: 'error',
          message: 'החופשה לא נמצאה'
        });
      }

      if (imageFile) {
        if (vacation.imageUrl) {
          const oldImagePath = path.join(__dirname, '../..', vacation.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        vacationData.imageUrl = `/uploads/vacations/${imageFile.filename}`;
      }

      Object.assign(vacation, vacationData);
      await this.vacationRepository.save(vacation);

      const updatedVacation = await this.vacationRepository
        .createQueryBuilder('vacation')
        .loadRelationCountAndMap(
          'vacation.followersCount',
          'vacation.follows'
        )
        .where('vacation.id = :id', { id })
        .getOne();

      res.json({
        status: 'success',
        data: {
          vacation: {
            ...updatedVacation,
            followersCount: updatedVacation?.followersCount || 0,
            isFollowing: false
          }
        }
      });
    } catch (error) {
      console.error('Error updating vacation:', error);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בעדכון החופשה'
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const vacation = await this.vacationRepository.findOne({ 
        where: { id: Number(id) },
        relations: ['follows']
      });

      if (!vacation) {
        return res.status(404).json({
          status: 'error',
          message: 'החופשה לא נמצאה'
        });
      }

      // First delete all follows
      if (vacation.follows) {
        await this.followRepository.remove(vacation.follows);
      }

      // Delete image if exists
      if (vacation.imageUrl) {
        const imagePath = path.join(__dirname, '../..', vacation.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Finally delete the vacation
      await this.vacationRepository.remove(vacation);

      res.json({
        status: 'success',
        message: 'החופשה נמחקה בהצלחה'
      });
    } catch (error) {
      console.error('Error deleting vacation:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה במחיקת החופשה'
      });
    }
  };

  follow = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const vacation = await this.vacationRepository.findOne({ where: { id: Number(id) } });
      if (!vacation) {
        return res.status(404).json({
          status: 'error',
          message: 'החופשה לא נמצאה'
        });
      }

      const existingFollow = await this.followRepository.findOne({
        where: {
          user: { id: userId },
          vacation: { id: Number(id) }
        }
      });

      if (existingFollow) {
        return res.status(400).json({
          status: 'error',
          message: 'כבר עוקב אחרי חופשה זו'
        });
      }

      const follow = this.followRepository.create({
        user: { id: userId } as User,
        vacation: { id: Number(id) } as Vacation
      });

      await this.followRepository.save(follow);

      res.json({
        status: 'success',
        message: 'מעקב אחרי החופשה נוסף בהצלחה'
      });
    } catch (error) {
      console.error('Error following vacation:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בהוספת מעקב'
      });
    }
  };

  unfollow = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const follow = await this.followRepository.findOne({
        where: {
          user: { id: userId },
          vacation: { id: Number(id) }
        }
      });

      if (!follow) {
        return res.status(404).json({
          status: 'error',
          message: 'לא נמצא מעקב אחרי חופשה זו'
        });
      }

      await this.followRepository.remove(follow);

      res.json({
        status: 'success',
        message: 'הסרת המעקב בוצעה בהצלחה'
      });
    } catch (error) {
      console.error('Error unfollowing vacation:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בהסרת המעקב'
      });
    }
  };

  getFollowersStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.vacationRepository
        .createQueryBuilder('vacation')
        .loadRelationCountAndMap(
          'vacation.followersCount',
          'vacation.follows'
        )
        .getMany();

      const formattedStats = stats
        .filter(vacation => (vacation.followersCount || 0) > 0)
        .map(vacation => ({
          destination: vacation.destination,
          followers: vacation.followersCount || 0
        }));

      res.json({
        status: 'success',
        data: {
          stats: formattedStats
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בטעינת הסטטיסטיקות'
      });
    }
  };

  exportToCsv = async (req: Request, res: Response) => {
    try {
      const stats = await this.vacationRepository
        .createQueryBuilder('vacation')
        .loadRelationCountAndMap(
          'vacation.followersCount',
          'vacation.follows'
        )
        .getMany();

      const csvData = stats
        .filter(vacation => (vacation.followersCount || 0) > 0)
        .map(vacation => `${vacation.destination},${vacation.followersCount || 0}`)
        .join('\n');

      const csvContent = `Destination,Followers\n${csvData}`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=vacation-stats.csv');
      res.send(csvContent);
    } catch (error) {
      console.error('Error exporting stats:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בייצוא הסטטיסטיקות'
      });
    }
  };
} 