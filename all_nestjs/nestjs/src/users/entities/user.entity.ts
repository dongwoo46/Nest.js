import { Role } from 'src/auth/roles/role.enum';
import { Report } from 'src/reports/entities/report.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column()
  role: string;

  @Column()
  roleNumber: number;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
