//auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // moduleRef와 passReqToCallback은 커스텀할때 스코프 정할때 사용하는 것
  constructor(
    private authService: AuthService,
    private moduleRef: ModuleRef,
  ) {
    /*
    이 부분 callback 때문에 순환참조 발생
    super({ passReqToCallback: true });
    */
    super();

  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

}