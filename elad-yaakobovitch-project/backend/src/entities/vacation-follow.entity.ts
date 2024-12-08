import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Vacation } from './vacation.entity';

@Entity('vacation_follows')
export class VacationFollow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.follows)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Vacation, vacation => vacation.follows)
  @JoinColumn({ name: 'vacationId' })
  vacation: Vacation;

  @CreateDateColumn()
  createdAt: Date;
} 