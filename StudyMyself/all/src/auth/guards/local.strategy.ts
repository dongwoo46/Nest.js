//auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { AuthService } from '../auth.service';

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
  private readonly logger = new Logger(AuthService.name);

  async validate(email: string, password: string): Promise<any> {
    this.logger.log('asdfasfdasdf');

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
