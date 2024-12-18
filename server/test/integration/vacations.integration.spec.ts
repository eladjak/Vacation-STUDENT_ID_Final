/**
 * בדיקות אינטגרציה למודול החופשות
 * בודק את האינטגרציה בין השירותים השונים והמסד נתונים
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacationsService } from '../../src/vacations/vacations.service';
import { FileService } from '../../src/shared/services/file.service';
import { Vacation } from '../../src/entities/vacation.entity';
import { CreateVacationDto } from '../../src/vacations/dto/create-vacation.dto';
import { ConfigService } from '@nestjs/config';

describe('VacationsService Integration', () => {
  let vacationsService: VacationsService;
  let fileService: FileService;
  let vacationRepository: Repository<Vacation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacationsService,
        FileService,
        ConfigService,
        {
          provide: getRepositoryToken(Vacation),
          useClass: Repository,
        },
      ],
    }).compile();

    vacationsService = module.get<VacationsService>(VacationsService);
    fileService = module.get<FileService>(FileService);
    vacationRepository = module.get<Repository<Vacation>>(getRepositoryToken(Vacation));
  });

  /**
   * בדיקת תהליך יצירת חופשה מלא כולל טיפול בתמונות
   */
  describe('createVacationWithImages', () => {
    it('should create vacation with images and handle file uploads', async () => {
      // מדמה קובץ תמונה
      const mockFile = {
        buffer: Buffer.from('test image'),
        originalname: 'test.jpg',
      } as Express.Multer.File;

      // מדמה שמירת קובץ
      jest.spyOn(fileService, 'saveFile').mockResolvedValue('uploads/test.jpg');

      const createDto: CreateVacationDto = {
        title: 'Beach Vacation',
        description: 'Relaxing beach vacation',
        destination: 'Hawaii',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-07'),
        price: 1500,
        maxParticipants: 20,
        imageUrls: [],
      };

      const savedVacation = await vacationsService.create(createDto);
      expect(savedVacation).toBeDefined();
      expect(savedVacation.imageUrls).toContain('uploads/test.jpg');
    });
  });

  /**
   * בדיקת עדכון מספר המקומות הפנויים
   */
  describe('updateRemainingSpots', () => {
    it('should correctly update remaining spots when user books vacation', async () => {
      const vacation = new Vacation();
      vacation.maxParticipants = 10;
      vacation.remainingSpots = 10;

      jest.spyOn(vacationRepository, 'findOne').mockResolvedValue(vacation);
      jest.spyOn(vacationRepository, 'save').mockResolvedValue(vacation);

      const updatedVacation = await vacationsService.bookSpot(vacation.id);
      expect(updatedVacation.remainingSpots).toBe(9);
    });

    it('should throw error when no spots available', async () => {
      const vacation = new Vacation();
      vacation.maxParticipants = 10;
      vacation.remainingSpots = 0;

      jest.spyOn(vacationRepository, 'findOne').mockResolvedValue(vacation);

      await expect(vacationsService.bookSpot(vacation.id))
        .rejects
        .toThrow('No spots available');
    });
  });

  /**
   * בדיקת פילטור ומיון חופשות
   */
  describe('findVacationsWithFilters', () => {
    it('should filter vacations by date range and price', async () => {
      const mockVacations: Partial<Vacation>[] = [
        {
          id: '1',
          title: 'Beach Vacation',
          description: 'Amazing beach vacation',
          destination: 'Hawaii',
          startDate: new Date('2024-06-15'),
          endDate: new Date('2024-06-22'),
          price: 1500,
          maxParticipants: 10,
          remainingSpots: 10,
          imageUrls: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(vacationRepository, 'find').mockResolvedValue(mockVacations as Vacation[]);

      const filters = {
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-30'),
        minPrice: 1000,
        maxPrice: 2000,
      };

      const filteredVacations = await vacationsService.findWithFilters(filters);
      expect(filteredVacations).toHaveLength(1);
      expect(filteredVacations[0].price).toBeLessThanOrEqual(filters.maxPrice);
    });
  });

  /**
   * בדיקת מחיקת חופשה כולל הקבצים המשויכים
   */
  describe('deleteVacationWithFiles', () => {
    it('should delete vacation and associated files', async () => {
      const vacation = new Vacation();
      vacation.id = '1';
      vacation.imageUrls = ['uploads/test1.jpg', 'uploads/test2.jpg'];

      jest.spyOn(vacationRepository, 'findOne').mockResolvedValue(vacation);
      jest.spyOn(vacationRepository, 'remove').mockResolvedValue(vacation);
      jest.spyOn(fileService, 'deleteFile').mockResolvedValue();

      await vacationsService.remove(vacation.id);

      expect(fileService.deleteFile).toHaveBeenCalledTimes(2);
      expect(vacationRepository.remove).toHaveBeenCalledWith(vacation);
    });
  });
}); 