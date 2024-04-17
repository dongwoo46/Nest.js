import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User') // 클래스명을 안적으면 원래 클래스와 같음
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  password: string;

  @Column({ length: 60 })
  signupVerifyToken: string;
}
