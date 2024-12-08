import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VacationFollow } from './vacation-follow.entity';

@Entity('vacations')
export class Vacation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  destination: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => VacationFollow, follow => follow.vacation)
  follows: VacationFollow[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual fields
  followersCount: number = 0;
  isFollowing?: boolean;
} 