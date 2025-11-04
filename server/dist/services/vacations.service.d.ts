import { Vacation } from '../entities/vacation.entity';
import { CreateVacationDto, UpdateVacationDto } from '../vacations/dto';
export declare class VacationsService {
    private vacationRepository;
    private followRepository;
    private userRepository;
    constructor();
    private initializeRepositories;
    findAll(userId?: string, page?: number, limit?: number, filters?: {
        followed?: boolean;
        active?: boolean;
        upcoming?: boolean;
    }): Promise<{
        vacations: Vacation[];
        total: number;
    }>;
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
    getFollowersStats(): Promise<{
        destination: string;
        followersCount: string;
    }[]>;
    private deleteImageFile;
}
