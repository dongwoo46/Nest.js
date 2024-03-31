import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // 리퀘스트 핸들러로 요청이 처리되기 전에 실행되는 곳

    // 나가는 응답을 조작하고 싶으면
    return handler.handle().pipe(
      map((data: any) => {
        //응답이 나가기 전에 응답을 처리하고 싶을 때 조작
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, //UserDto 인스턴스가 있고 기본 JSON으로 변환할때마다 Expose로 표시된 속성만 공유
        });
      }),
    );
  }
}
