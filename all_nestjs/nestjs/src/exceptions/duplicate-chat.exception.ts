import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateChatException extends HttpException {
  constructor() {
    super('중복된 채팅방 이름입니다.', HttpStatus.BAD_REQUEST);
  }
}
