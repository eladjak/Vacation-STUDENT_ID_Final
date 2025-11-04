import { Repository } from 'typeorm';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';
import { CreateVacationDto, UpdateVacationDto } from './dto';
export declare class VacationsService {
    private readonly vacationRepository;
    private readonly followRepository;
    constructor(vacationRepository: Repository<Vacation>, followRepository: Repository<VacationFollow>);
    findAll(): Promise<Vacation[]>;
    findOne(id: string): Promise<Vacation>;
    create(createVacationDto: CreateVacationDto): Promise<Vacation>;
    update(id: string, updateVacationDto: UpdateVacationDto): Promise<Vacation>;
    remove(id: string): Promise<void>;
    follow(userId: string, vacationId: string): Promise<{
        isFollowing: boolean;
        followersCount: number;
    }>;
    unfollow(userId: string, vacationId: string): Promise<{
        isFollowing: boolean;
        followersCount: number;
    }>;
    getFollowersStats(): Promise<any[]>;
}
