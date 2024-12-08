import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { VacationFollow } from './VacationFollow';

@Entity('vacations')
export class Vacation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  destination!: string;

  @Column('text')
  description!: string;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  endDate!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column()
  imageUrl!: string;

  @OneToMany(() => VacationFollow, follow => follow.vacation)
  followers!: VacationFollow[];

  @Column({ default: 0 })
  followersCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // שדה וירטואלי לסימון האם המשתמש הנוכחי עוקב אחרי החופשה
  isFollowing?: boolean;
} 