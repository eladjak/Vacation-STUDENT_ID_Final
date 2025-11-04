import { VacationFollow } from '../entities/vacation-follow.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    isEmailVerified: boolean;
    verificationToken: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    follows: VacationFollow[];
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}
