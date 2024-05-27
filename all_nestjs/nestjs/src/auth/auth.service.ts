import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async login(@Request() req, @Res() res: exRes) {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    res.clearCookie('accessToken', {
      httpOnly: true,
      path: '/',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      path: '/',
    });

    if (accessToken) {
      await this.addToBlacklist('accessTokenBlacklist', accessToken);
    }
    if (refreshToken) {
      await this.addToBlacklist('refreshTokenBlacklist', refreshToken);
    }

    const tokens = await this.generateToken(req.user);
    const newAccessToken = tokens.accessToken;
    const newRefreshToken = tokens.refreshToken;
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      path: '/',
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      path: '/',
      // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    //응답을 express 타입으로 불러왔기 때문에, 기존에 nest에서 하던대로 return으로 반환하는 것이 아닌, res.send로 반환
    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }

  //회원 로그아웃
  async signout(@Request() req: exReq, @Res() res: exRes) {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];
    if (!accessToken || !refreshToken) {
      throw new BadRequestException('이미 로그아웃된 유저입니다.');
    }
    await this.addToBlacklist('accessTokenBlacklist', accessToken);
    await this.addToBlacklist('refreshTokenBlacklist', refreshToken);

    // 쿠키 삭제
    res.clearCookie('accessToken', {
      httpOnly: true,
      path: '/',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      path: '/',
    });
    return res.json({ message: '로그아웃 되었습니다.' });
  }

  // 유효한 user인지 비밀번호와 id 체크
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

  // refresh, access 토큰 생성
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

  private async addToBlacklist(key: string, token: string): Promise<void> {
    let blacklist = await this.cacheManager.get<string[]>(key);

    if (!blacklist) {
      blacklist = [];
    }
    if (blacklist.includes(token)) {
      return;
    }
    blacklist.push(token);
    await this.cacheManager.set(key, blacklist, 300000); // 7일 TTL 설정 (초 단위)
  }

  async isTokenBlacklisted(
    token: string,
    type: 'accessToken' | 'refreshToken',
  ): Promise<string[]> {
    const key =
      type === 'accessToken' ? 'accessTokenBlacklist' : 'refreshTokenBlacklist';
    const blacklist = (await this.cacheManager.get<string[]>(key)) || [];
    return blacklist;
  }

  async checkCookieAccessToken(@Req() req: exReq): Promise<Boolean> {
    const cookieAccessToken = req.cookies['accessToken'];
    if (!cookieAccessToken) {
      return false;
    }
    return cookieAccessToken;
  }
}
