import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.entity';

// jwt startegy를 다른 곳에서도 사용하기 위해 넣어줌
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      secretOrKey: 'Secret1234', // 여기서 secretOrKey를 수정했습니다.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 여기서 jwtFromReqeust를 수정했습니다.
    });
  }

  async validate(payload: any) {
    const { username } = payload;
    const user: User = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
