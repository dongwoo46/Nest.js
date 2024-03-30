import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  static find: () => Promise<User[]>;
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
    // return this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
    //return this.repo.find({email});
  }

  // Partial은 <User>가 가진 속성의 일부, 전부, null까지 받을 수 있다
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id); //db에서 사용자 찾는 것은 비동기작업이라 await씀

    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs); //찾은 user에 attrs를 복사

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.repo.remove(user);
  }
}
