import { User } from './user.entity';
import { Vacation } from './vacation.entity';
export declare class Booking {
    id: string;
    user: User;
    vacation: Vacation;
    numberOfParticipants: number;
    status: string;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
