import { Exclude } from 'class-transformer';
import { Report } from '../reports/report.entity';

import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  //Report 타입을 연결해줌, 생성되지 않았을 때 참조할 수 있어 엔티티를 함수로 감싸는것
  // class가 생성되지 않았을 때 에러가 발생하기 때문에 코드가 실제로 실행되었을때 이관계가 무엇을 의미하는지 파악하고 정의
  // 순환 의존성 해결
  // 두번째 인자는 함수이고 관계를 연결할 엔티티의 인스턴스를 사용
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('inserted user with  id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('update user with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('removed user with id', this.id);
  }
}
