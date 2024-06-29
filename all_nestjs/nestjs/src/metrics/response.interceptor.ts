import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { defaultIfEmpty, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();

    const excludePaths = ['/api/capa-metrics', '/capa-metrics'];

    return next.handle().pipe(
      defaultIfEmpty(null),
      map((result) => {
        if (excludePaths.includes(req.url)) {
          return result;
        }
        // CAPA4.0 표준 응답으로 변환하여 반환
        return new ResponseObj(true, result);
      }),
    );
  }
}

// CAPA4.0 표준 응답 객체 정의
class ResponseObj {
  constructor(
    public success: boolean,
    public data: any,
    public message?: string,
    public error?: any,
  ) {}
}
