/**
 * Main Application Module
 * 
 * This is the root module of the application that ties together all other modules
 * and provides application-wide configuration.
 * 
 * Features:
 * - Environment configuration
 * - Database connection
 * - File upload handling
 * - Static file serving
 * - Global validation
 * - Global error handling
 * - API documentation
 */
import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_PIPE, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { VacationController } from './controllers/vacation.controller';

// Services
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { VacationsService } from './services/vacations.service';

// Entities
import { User } from './entities/user.entity';
import { Vacation } from './entities/vacation.entity';
import { VacationFollow } from './entities/vacation-follow.entity';

// Filters and Interceptors
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Vacation, VacationFollow],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        charset: 'utf8mb4',
        timezone: 'Z',
        ssl: configService.get('NODE_ENV') === 'production',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Vacation, VacationFollow]),
    MulterModule.register(multerConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
        maxAge: '1d',
      },
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    VacationController
  ],
  providers: [
    AuthService,
    UsersService,
    VacationsService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {} 