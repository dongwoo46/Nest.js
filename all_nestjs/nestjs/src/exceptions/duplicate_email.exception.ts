import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateEmailException extends HttpException {
  constructor() {
    super('중복된 이메일입니다.', HttpStatus.BAD_REQUEST);
  }
}
