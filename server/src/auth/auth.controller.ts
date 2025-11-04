/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register new user endpoint
   * @param registrationData - User registration data from request body
   * @returns Newly created user data and JWT token
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registrationData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
    }
  ) {
    return this.authService.register(registrationData);
  }

  /**
   * Login endpoint
   * @param loginData - User login credentials
   * @returns Authenticated user data and JWT token
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginData: { email: string; password: string }
  ) {
    const user = await this.authService.validateUser(
      loginData.email,
      loginData.password
    );
    const token = await this.authService.generateToken(user);
    return { user, token };
  }
} 