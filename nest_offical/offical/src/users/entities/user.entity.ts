import { Role } from 'src/enums/role.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 'admin' })
  roles: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isAdmin: boolean;
}
