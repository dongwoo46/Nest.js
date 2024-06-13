import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  replyId: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.replies)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  comment: Comment;

  @ManyToOne(() => Reply, (reply) => reply.childReplies)
  parent: Reply;

  @OneToMany(() => Reply, (reply) => reply.parent)
  childReplies: Reply[];
}
