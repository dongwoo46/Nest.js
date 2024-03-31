import { CanActivate, ExecutionContext } from '@nestjs/common';

// 애플리케이션에 로그인 상태 확인, 특정 라우트 핸들러에 대한 엑세스 제한
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
  }
}
