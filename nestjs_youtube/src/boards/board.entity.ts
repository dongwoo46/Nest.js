import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: BoardStatus;

  //User의 타입, user에서 보드에 접근하려면, eager가 true이면 해당 값을 가져올 때 연관관계된것도 가져옴
  @ManyToOne((type) => User, (user) => user.boards, { eager: false })
  user: User;
}
