/**
 * Vacation DTOs
 * Contains all Data Transfer Objects related to vacation operations
 */
import { 
  IsString, 
  IsNumber, 
  IsDate, 
  IsOptional, 
  IsArray, 
  Min, 
  Max,
  IsUrl,
  MinLength,
  MaxLength,
  IsPositive,
  ArrayMinSize,
  ArrayMaxSize,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';
import { Vacation } from '../../entities/vacation.entity';

export class CreateVacationDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  destination: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(1000)
  maxParticipants: number;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(10)
  imageUrls?: string[];
}

export class UpdateVacationDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  destination?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(1000000)
  price?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(1000)
  maxParticipants?: number;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(10)
  imageUrls?: string[];
}

export class BookingSpotsDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100)
  numberOfSpots: number;
}

export class VacationResponseDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  destination: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  @IsNumber()
  @Min(0)
  followersCount: number;

  @IsNumber()
  @Min(1)
  maxParticipants: number;

  @IsNumber()
  @Min(0)
  currentParticipants: number;

  @IsOptional()
  isFollowing?: boolean;

  remainingSpots: number;

  static fromEntity(vacation: Vacation, isFollowing = false): VacationResponseDto {
    const dto = new VacationResponseDto();
    Object.assign(dto, {
      ...vacation,
      isFollowing,
      remainingSpots: vacation.calculateRemainingSpots()
    });
    return dto;
  }

  calculateRemainingSpots(): number {
    return Math.max(0, this.maxParticipants - this.currentParticipants);
  }
}

export class FollowResponseDto {
  @IsNumber()
  isFollowing: boolean;

  @IsNumber()
  followersCount: number;
} 