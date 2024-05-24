import {
  Body,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DuplicateEmailException } from 'src/exceptions/duplicate_email.exception';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import * as uuid from 'uuid';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDto } from 'src/email/verify-email.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmailFailException } from 'src/exceptions/email-fail.exception';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: Logger,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async signUp(createUserDto: CreateUserDto) {
    const { email, password, nickname, ip, role } = createUserDto;
    // 동일 이메일 찾기
    const userUsingEmail = await this.findOneByEmail(email);
    // 동일 닉네임 찾기
    const userUsingNickname = await this.findOneByNickName(nickname);
    if (userUsingEmail || userUsingNickname) {
      throw new DuplicateEmailException();
    }

    // await this.sendMemberJoinEmail(email, signupVerifyToken);

    // 비밀번호 해시
    // salt 생성
    const salt = randomBytes(8).toString('hex');

    // salt 와 password 이용 해시 만들기
    const hash = (await scrypt(password, salt, 32)) as Buffer; // scrypt는 해시로 변환된 결과를 받게된다 이때ㅔ 해시를 몇글자로 할지 해시길이를 세번째 인자로 정한다. scrypt가 반환하는것이 Buffer

    // 해시결과와 salt 합치기
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersRepository.create(createUserDto);
    user.password = result;

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

  // 가입한사람에게 가입 안중 매알보내기 (버튼 인증식)
  // private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
  //   await this.emailService.sendMemberJoinVerification(
  //     email,
  //     signupVerifyToken,
  //   );
  // }

  // // 가입한사람에게 가입인증 토큰보내기
  // private async sendMemberJoinEmailShowToken(
  //   email: string,
  //   signupVerifyToken: string,
  // ) {
  //   await this.emailService.sendSignUpVerifyToken(email, signupVerifyToken);
  // }
}
