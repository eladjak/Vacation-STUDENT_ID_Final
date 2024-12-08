import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique
} from 'typeorm';
import { User } from './User';
import { Vacation } from './Vacation';

@Entity('vacation_follows')
@Unique(['userId', 'vacationId'])
export class VacationFollow {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'userId' })
  userId!: number;

  @Column({ name: 'vacationId' })
  vacationId!: number;

  @ManyToOne(() => User, user => user.followedVacations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Vacation, vacation => vacation.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vacationId' })
  vacation!: Vacation;

  @CreateDateColumn()
  createdAt!: Date;
} 