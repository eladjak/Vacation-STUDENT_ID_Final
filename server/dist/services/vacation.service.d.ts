import { Vacation } from '../entities/Vacation';
export declare class VacationService {
    private vacationRepository;
    private followRepository;
    private userRepository;
    constructor();
    private deleteImageFile;
    getAllVacations(userId: number, page?: number, limit?: number, filters?: {
        followed?: boolean;
        active?: boolean;
        upcoming?: boolean;
    }): Promise<{
        vacations: Vacation[];
        total: number;
    }>;
    getVacationById(id: number): Promise<Vacation>;
    createVacation(vacationData: Partial<Vacation>): Promise<Vacation>;
    updateVacation(id: number, vacationData: Partial<Vacation>): Promise<Vacation>;
    deleteVacation(id: number): Promise<void>;
    followVacation(vacationId: number, userId: number): Promise<void>;
    unfollowVacation(vacationId: number, userId: number): Promise<void>;
    getFollowersStats(): Promise<{
        destination: string;
        followers: number;
    }[]>;
    exportToCsv(): Promise<string>;
}
