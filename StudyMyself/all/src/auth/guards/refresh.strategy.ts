import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  private readonly logger = new Logger();

  async validate(request: Request, payload: any) {
    const refreshToken = request.cookies['refreshToken'];

    this.logger.log(refreshToken);
    return this.usersService.refreshTokenMatches(refreshToken, payload.userId);
  }
}
