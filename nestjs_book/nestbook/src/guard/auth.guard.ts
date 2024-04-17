import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any): boolean {
    // 여기에서 요청을 검사하여 사용자의 권한을 확인하는 로직을 구현합니다.
    // 예를 들어, 요청의 헤더에서 인증 토큰을 확인하고, 사용자의 권한을 가져와서 검사합니다.
    // 이 예제에서는 단순히 사용자가 admin 권한을 가지고 있는지 확인하는 것으로 가정합니다.
    const user = request.user; // 요청에서 사용자 정보를 가져온다고 가정합니다.

    // 사용자가 admin 권한을 가지고 있는지 확인합니다.
    if (user && user.role === 'admin') {
      return true; // 사용자가 admin 권한을 가지고 있으면 요청을 허용합니다.
    }

    return false; // 사용자가 admin 권한을 가지고 있지 않으면 요청을 거부합니다.
  }
}
