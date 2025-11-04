import { VacationFollow } from './vacation-follow.entity';
export type UserRole = 'user' | 'admin';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    follows: VacationFollow[];
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    hashPassword(): Promise<void>;
    getFullName(): string;
    isAdmin(): boolean;
    isFollowingVacation(vacationId: string): boolean;
    getFollowedVacationIds(): string[];
    verifyPassword(password: string): Promise<boolean>;
}
