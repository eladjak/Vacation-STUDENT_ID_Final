import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { VacationFollow } from './VacationFollow';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role!: UserRole;

  @OneToMany(() => VacationFollow, follow => follow.user)
  followedVacations!: VacationFollow[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // מתודה להסרת שדות רגישים בעת החזרת המשתמש
  toJSON() {
    const { password, ...user } = this;
    return user;
  }
} 