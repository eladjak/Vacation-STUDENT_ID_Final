import { Repository } from 'typeorm';
import { Vacation } from '../entities/vacation.entity';
export declare class BookingsService {
    private readonly vacationRepository;
    constructor(vacationRepository: Repository<Vacation>);
    findOne(id: string): Promise<Vacation>;
    updateStatus(id: string, status: string): Promise<Vacation>;
    createBooking(bookingData: {
        vacationId: string;
        numberOfParticipants: number;
    }): Promise<{
        success: boolean;
        message: string;
        remainingSpots: number;
    }>;
}
