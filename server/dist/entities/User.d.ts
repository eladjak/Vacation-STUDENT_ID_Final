import { VacationFollow } from './VacationFollow';
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    followedVacations: VacationFollow[];
    createdAt: Date;
    updatedAt: Date;
    toJSON(): Omit<this, "password" | "toJSON">;
}
