import { User } from '../entities/user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor();
    findById(id: string): Promise<User>;
    updateProfile(id: string, updateData: Partial<User>): Promise<User>;
    changePassword(id: string, currentPassword: string, newPassword: string): Promise<void>;
    getFollowedVacations(userId: string): Promise<any[]>;
}
