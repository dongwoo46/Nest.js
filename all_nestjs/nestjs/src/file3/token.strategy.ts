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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request as exReq } from 'express';
import { jwtConstants } from 'src/auth/constants';
import { File3Service } from './file3.service';

@Injectable()
@Injectable()
@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'token') {
  constructor(private readonly file3Service: File3Service) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'), // 쿼리 파라미터에서 토큰 추출
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.log(payload);
    const filePath = payload.filePath;
    if (!filePath) {
      throw new UnauthorizedException();
    }
    return { filePath };
  }
}
