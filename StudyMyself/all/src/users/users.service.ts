import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DuplicateEmailException } from 'src/exceptions/duplicate_email.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async signUp(createUserDto: CreateUserDto) {
    const { email, password, nickname, ip, role } = createUserDto;
    const userUsingEmail = await this.findOneByEmail(email);
    const userUsingNickname = await this.findOneByNickName(nickname);
    if (userUsingEmail || userUsingNickname) {
      throw new DuplicateEmailException();
    }

    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async getAllUsers() {
    return this.usersRepository.find({ relations: ['reports'] });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async findOneById(userId: number): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: { userId: userId },
    });
  }
  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: { email: email },
    });
  }
  async findOneByNickName(nickname: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: { nickname: nickname },
    });
  }

  async findOneByRefreshToken(refreshToken: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ refreshToken: refreshToken });
  }

  findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ username: username });
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
