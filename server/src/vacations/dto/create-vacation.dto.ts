import { IsNotEmpty, IsDate, IsNumber, Min, Max, IsString, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVacationDto {
    @IsNotEmpty({ message: 'יש להזין כותרת לחופשה' })
    @IsString()
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'יש להזין תיאור לחופשה' })
    description: string;

    @IsString()
    @IsNotEmpty({ message: 'יש להזין יעד' })
    destination: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty({ message: 'יש להזין תאריך התחלה' })
    startDate: Date;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty({ message: 'יש להזין תאריך סיום' })
    endDate: Date;

    @IsNumber()
    @Min(0, { message: 'המחיר חייב להיות חיובי' })
    price: number;

    @IsNumber()
    @Min(0)
    @Max(100, { message: 'מספר המשתתפים המקסימלי הוא 100' })
    maxParticipants: number;

    @IsArray()
    @IsOptional()
    imageUrls?: string[];
} 