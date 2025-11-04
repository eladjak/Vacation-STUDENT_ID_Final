import { Vacation } from '../../entities/vacation.entity';
export declare class CreateVacationDto {
    title: string;
    description: string;
    destination: string;
    price: number;
    startDate: Date;
    endDate: Date;
    maxParticipants: number;
    imageUrls?: string[];
}
export declare class UpdateVacationDto {
    title?: string;
    description?: string;
    destination?: string;
    price?: number;
    startDate?: Date;
    endDate?: Date;
    maxParticipants?: number;
    imageUrls?: string[];
}
export declare class BookingSpotsDto {
    numberOfSpots: number;
}
export declare class VacationResponseDto {
    id: string;
    title: string;
    description: string;
    destination: string;
    price: number;
    startDate: Date;
    endDate: Date;
    imageUrls: string[];
    followersCount: number;
    maxParticipants: number;
    currentParticipants: number;
    isFollowing?: boolean;
    remainingSpots: number;
    static fromEntity(vacation: Vacation, isFollowing?: boolean): VacationResponseDto;
    calculateRemainingSpots(): number;
}
export declare class FollowResponseDto {
    isFollowing: boolean;
    followersCount: number;
}
