import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // http 요청 시(cotroller)에서 인수를 받지 않기때문에 data never
  (data: never, context: ExecutionContext) => {
    // 들어온 요청을 확인 ExecutionContext(요청을 감싸는 래퍼)가 정보를 담음
    // 다양한 통신 프로토콜을 대상으로 요청을 감쌀 수 있음
    const request = context.switchToHttp().getRequest();
    return request.currentUser; // 인터셉터에서 request안에 currentUser로 값을 넣어준것

    // 데코레이터에서는 DI를 사용할 수 없어 UsersService의 인스턴스를 사용할 수 없음 => 인터셉터만들기
    // 인터셉터가 세션을 읽고 의존성 주입을 통해 UsersService에 접근하고 인터셉터 안에서 로그인한 사용자 조회하고 데코레이터로 노출
  },
);
