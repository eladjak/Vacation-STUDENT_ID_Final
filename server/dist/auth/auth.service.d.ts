import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
interface RegistrationDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registrationData: RegistrationDto): Promise<{
        user: any;
        token: string;
    }>;
    validateUser(email: string, password: string): Promise<any>;
    generateToken(user: any): Promise<string>;
    private isPasswordStrong;
    private sendVerificationEmail;
}
export {};
