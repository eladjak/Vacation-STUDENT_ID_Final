import { Exclude, Expose } from 'class-transformer';

export class VacationResponseDto {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    destination: string;

    @Expose()
    startDate: Date;

    @Expose()
    endDate: Date;

    @Expose()
    price: number;

    @Expose()
    maxParticipants: number;

    @Expose()
    remainingSpots: number;

    @Expose()
    imageUrls: string[];

    @Expose()
    followersCount: number;

    @Expose()
    isFollowing: boolean;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    constructor(partial: Partial<VacationResponseDto>) {
        Object.assign(this, partial);
    }
} 