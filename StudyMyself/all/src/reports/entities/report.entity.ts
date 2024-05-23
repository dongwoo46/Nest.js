import { IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  reportId: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  level: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @Column()
  isPublished: boolean;
}
