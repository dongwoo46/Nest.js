import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatMessage } from './chatMessage.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  chatId: number;

  @Column()
  name: string;

  @OneToMany(() => ChatMessage, (message) => message.chat)
  chatMessages: ChatMessage[];

  @OneToMany(() => User, (user) => user.chats)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
