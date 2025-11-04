import { User } from './User';
import { Vacation } from './Vacation';
export declare class VacationFollow {
    id: number;
    userId: number;
    vacationId: number;
    user: User;
    vacation: Vacation;
    createdAt: Date;
}
