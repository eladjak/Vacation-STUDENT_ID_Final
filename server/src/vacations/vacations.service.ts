import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';
import { CreateVacationDto, UpdateVacationDto, VacationResponseDto } from './dto';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
    @InjectRepository(VacationFollow)
    private readonly followRepository: Repository<VacationFollow>
  ) {}

  async findAll(): Promise<Vacation[]> {
    return this.vacationRepository.find();
  }

  async findOne(id: string): Promise<Vacation> {
    const vacation = await this.vacationRepository.findOne({ where: { id } });
    if (!vacation) {
      throw new NotFoundException(`Vacation with ID ${id} not found`);
    }
    return vacation;
  }

  async create(createVacationDto: CreateVacationDto): Promise<Vacation> {
    const vacation = this.vacationRepository.create(createVacationDto);
    return this.vacationRepository.save(vacation);
  }

  async update(id: string, updateVacationDto: UpdateVacationDto): Promise<Vacation> {
    const vacation = await this.findOne(id);
    Object.assign(vacation, updateVacationDto);
    return this.vacationRepository.save(vacation);
  }

  async remove(id: string): Promise<void> {
    const vacation = await this.findOne(id);
    await this.vacationRepository.remove(vacation);
  }

  async follow(userId: string, vacationId: string): Promise<{ isFollowing: boolean; followersCount: number }> {
    const vacation = await this.findOne(vacationId);
    
    const existingFollow = await this.followRepository.findOne({
      where: { userId, vacation: { id: vacationId } }
    });

    if (existingFollow) {
      throw new BadRequestException('Already following this vacation');
    }

    const follow = this.followRepository.create({
      userId,
      vacation
    });
    await this.followRepository.save(follow);

    vacation.followersCount += 1;
    await this.vacationRepository.save(vacation);

    return {
      isFollowing: true,
      followersCount: vacation.followersCount
    };
  }

  async unfollow(userId: string, vacationId: string): Promise<{ isFollowing: boolean; followersCount: number }> {
    const vacation = await this.findOne(vacationId);
    
    await this.followRepository.delete({
      userId,
      vacation: { id: vacationId }
    });

    vacation.followersCount = Math.max(0, vacation.followersCount - 1);
    await this.vacationRepository.save(vacation);

    return {
      isFollowing: false,
      followersCount: vacation.followersCount
    };
  }

  async getFollowersStats(): Promise<any[]> {
    return this.vacationRepository
      .createQueryBuilder('vacation')
      .select(['vacation.id', 'vacation.title', 'vacation.followersCount'])
      .orderBy('vacation.followersCount', 'DESC')
      .getMany();
  }
} 