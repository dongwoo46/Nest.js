import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Req,
  Request,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Request as exReq } from 'express';
import { Response as exRes } from 'express';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(@Request() req, @Res() res: exRes) {
    const { accessToken, refreshToken } = await this.generateToken(req.user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    //응답을 express 타입으로 불러왔기 때문에, 기존에 nest에서 하던대로 return으로 반환하는 것이 아닌, res.send로 반환
    return res.send({ accessToken: accessToken });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('wrong password');
    }
    return user;
  }

  async generateToken(user: any) {
    const payload = { email: user.email, userId: user.userId };

    // 액세스 토큰 및 리프레시 토큰 생성
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersService.saveRefreshToken(user.userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async makeAccessTokenUsingRereshToken(
    refreshToken: string,
  ): Promise<string | null> {
    const user = await this.usersService.findOneByRefreshToken(refreshToken);
    if (!user) {
      return null; // 사용자가 존재하지 않으면 null 반환
    }

    // 새로운 액세스 토큰 발급
    const accessToken = this.jwtService.sign({ userId: user.userId });
    return accessToken;
  }
}
