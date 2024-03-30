import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // see if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // hash the users password
    // generate a salt
    const salt = randomBytes(8).toString('hex'); // 16자리 문자열 추출

    // hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer; // scrypt는 해시로 변환된 결과를 받게된다 이때ㅔ 해시를 몇글자로 할지 해시길이를 세번째 인자로 정한다. scrypt가 반환하는것이 Buffer

    // join the hased result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // create a new user and save it
    const user = await this.usersService.create(email, result);

    // return user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email); //사용자 배열을 받고싶은게 아니라 사용자이거나 없는 값만 가지고 싶어서 분할구조 이용

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
