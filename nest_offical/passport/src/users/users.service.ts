import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.username = createUserDto.username;
    user.password = createUserDto.password;

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ userId: id });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ username: username });
  }

  findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ refreshToken: refreshToken });
  }

  async saveRefreshToken(userId, refreshToken) {
    const user = await this.usersRepository.findOneBy(userId);

    user.refreshToken = refreshToken;

    return this.usersRepository.save(user);
  }

  async refreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<User> {
    const user = await this.findOneById(userId);
    if (refreshToken == user.refreshToken) {
      return user;
    }
    throw new HttpException('토큰 불일치', HttpStatus.UNAUTHORIZED);
  }
}
