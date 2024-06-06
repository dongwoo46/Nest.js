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

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable() // 관계를 정의하고 조인 테이블을 생성
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
