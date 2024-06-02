import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  chatMessageId: number;

  @Column()
  chatMessage: string;

  @OneToOne(() => User)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.chatMessages)
  chat: Chat;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
