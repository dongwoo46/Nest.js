import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailFailException extends HttpException {
  constructor() {
    super('이메일 인증에 실패 하셨습니다.', HttpStatus.BAD_REQUEST);
  }
}
