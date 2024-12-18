/**
 * Integration tests for Users module
 * Tests user registration, authentication and profile management
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/entities/user.entity';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('UsersService Integration', () => {
  let usersService: UsersService;
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('User Registration', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(userData as User);
      jest.spyOn(userRepository, 'save').mockResolvedValue({ id: '1', ...userData } as User);

      const result = await usersService.register(userData);
      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({ id: '1' } as User);

      await expect(usersService.register(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('Authentication', () => {
    it('should validate user credentials and return token', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user as User);
      jest.spyOn(authService, 'generateToken').mockResolvedValue('jwt_token');

      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toBeDefined();
      expect(result.id).toBe(user.id);
    });
  });
}); 