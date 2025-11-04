import { VacationFollow } from './vacation-follow.entity';
export declare class Vacation {
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
    follows: VacationFollow[];
    createdAt: Date;
    updatedAt: Date;
    get imageUrl(): string | null;
    calculateRemainingSpots(): number;
    isActive(): boolean;
    isUpcoming(): boolean;
    hasAvailableSpots(spots: number): boolean;
}
