import { Role } from 'src/auth/roles/role.enum';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatMessage } from 'src/chat/entities/chatMessage.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Reply } from 'src/reply/entities/reply.entity';
import { Report } from 'src/reports/entities/report.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';

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

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.user)
  chatMessages: ChatMessage[];

  @ManyToMany(() => Chat, (chat) => chat.users)
  chats: Chat[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Reply, (reply) => reply.user)
  replies: Reply[];
}
