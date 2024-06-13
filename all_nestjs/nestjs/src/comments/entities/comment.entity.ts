import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Report } from 'src/reports/entities/report.entity';
import { Reply } from 'src/reply/entities/reply.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Report, (report) => report.comments)
  report: Report;

  @OneToMany(() => Reply, (reply) => reply.comment)
  replies: Reply[];
}
