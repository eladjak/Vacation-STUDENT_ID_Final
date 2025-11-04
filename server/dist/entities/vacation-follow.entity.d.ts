import { Vacation } from './vacation.entity';
import { User } from './user.entity';
export declare class VacationFollow {
    id: string;
    vacation: Vacation;
    user: User;
    userId: string;
    createdAt: Date;
    constructor(data?: Partial<VacationFollow>);
    belongsToUser(userId: string): boolean;
    isForVacation(vacationId: string): boolean;
}
