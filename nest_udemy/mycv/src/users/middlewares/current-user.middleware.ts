import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

// 기존 인터페이스에 속성을 업데이트 또는 추가
declare global {
  // Express 라이브러리가서 Request 인터페이스 찾고
  namespace Express {
    interface Request {
      currentUser?: User; // 인터페이스에 속성 추가한다.
    }
  }
}

@Injectable() // 사용자 서비스에 엑세스하기위해 의존성 주입을 사용
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  // 미들웨어르 정의하려면 use함수를 사용해야한다 (비동기함수)
  // nex는 미들웨어 실행이 끝나면 next호출
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {}; // 세션객체가 없을 수도 있어서 빈객체를 만들어줌

    if (userId) {
      // 요청에 currentUser라는 속성이 있고 이것은 사용자 인스턴스이라는 것을 알려줘야함 -> declare 사용
      const user = await this.usersService.findOne(userId);
      req.currentUser = user;
    }

    next(); // 다음 미들웨어 실행
  }
}
