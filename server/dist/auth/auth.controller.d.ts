import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registrationData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phoneNumber?: string;
    }): Promise<{
        user: any;
        token: string;
    }>;
    login(loginData: {
        email: string;
        password: string;
    }): Promise<{
        user: any;
        token: string;
    }>;
}
