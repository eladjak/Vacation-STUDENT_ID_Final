import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacationsService } from './vacations.service';
import { Vacation } from '../entities/vacation.entity';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { NotFoundException } from '@nestjs/common';

describe('VacationsService', () => {
  let service: VacationsService;
  let repo: Repository<Vacation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacationsService,
        {
          provide: getRepositoryToken(Vacation),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VacationsService>(VacationsService);
    repo = module.get<Repository<Vacation>>(getRepositoryToken(Vacation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a vacation', async () => {
      const dto: CreateVacationDto = {
        title: 'Test Vacation',
        description: 'Test Description',
        destination: 'Test Destination',
        startDate: new Date(),
        endDate: new Date(),
        price: 100,
        maxParticipants: 10,
        imageUrls: [],
      };

      const vacation = { ...dto, id: 'test-id', remainingSpots: 10 };
      jest.spyOn(repo, 'create').mockReturnValue(vacation as Vacation);
      jest.spyOn(repo, 'save').mockResolvedValue(vacation as Vacation);

      const result = await service.create(dto);
      expect(result).toEqual(expect.objectContaining(dto));
    });
  });
}); 