import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request as exReq } from 'express';

export interface Payload {
  userId: number;
  email: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더 Authentication 에서 Bearer 토큰으로부터 jwt를 추출함
      ignoreExpiration: true, // jwt 만료를 무시할 것인지 (기본값: false -> 무시안함)
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true, // req 객체를 콜백 함수에 전달
    });
  }
  private readonly logger = new Logger();

  async validate(req: exReq, payload: Payload & { exp: number }) {
    const { userId, email, exp } = payload;
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req); // 헤더에서 토큰 추출
    const cookieAccessToken =
      await this.authService.checkCookieAccessToken(req);
    const expire = exp * 1000; //만료기간
    const isBlacklisted = await this.authService.isTokenBlacklisted(
      token,
      'accessToken',
    );

    if (!cookieAccessToken) {
      throw new UnauthorizedException('로그인된 사용자가 아닙니다.');
    }

    if (cookieAccessToken !== token) {
      throw new UnauthorizedException('사용할 수 없는 토큰입니다.');
    }

    if (isBlacklisted.includes(token)) {
      throw new UnauthorizedException('사용 불가능한 토큰입니다.');
    }
    if (userId && email) {
      if (Date.now() < expire) {
        // 토큰 유효
        return { userId, email };
      }
      // payload에 정보는 잘 있으나 token 만료
      throw new HttpException('토큰 만료', HttpStatus.UNAUTHORIZED);
    }
    // Payload에 정보가 없음
    throw new HttpException('접근 오류', HttpStatus.FORBIDDEN);
  }
}
