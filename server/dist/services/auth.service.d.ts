import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    private readonly userRepository;
    constructor(jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<any>;
    generateToken(user: any): Promise<string>;
}
