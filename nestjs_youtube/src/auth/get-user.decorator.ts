import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from './user.entity';

// 유저 정보만 불러오는 커스텀 데코레이터 만들기!
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
