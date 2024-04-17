import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware2 implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request2...');
    next();
  }
}
