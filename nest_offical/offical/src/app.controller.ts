import { Controller, Get, Res, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { Cookies } from './decorators/cookie.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/set-cookie')
  setCookie(@Res() res: Response) {
    // 쿠키 설정
    res.cookie('dongwoo2', 'dongwoosCookie2', {
      maxAge: 1000 * 60 * 60 * 24, // 쿠키 유효기간 24시간
      httpOnly: true, // 클라이언트의 JavaScript에서 쿠키에 접근할 수 없도록 설정
    });

    // 성공 응답
    return res.send('쿠키가 설정되었습니다.');
  }

  @Get('/get-cookie')
  getCookie(@Req() req: Request) {
    // 쿠키 가져오기
    const cookieValue = req.cookies['dongwoo2'];

    // 쿠키 값이 존재하는지 확인
    if (cookieValue) {
      return `쿠키 값: ${cookieValue}`;
    } else {
      return '쿠키가 존재하지 않습니다.';
    }
  }

  @Get('/get-cookie')
  getCookie2(@Cookies() cookies: any) {
    return cookies; // 모든 쿠키를 가져옴
  }

  @Get('/get-specific-cookie')
  getSpecificCookie(@Cookies('cookieName') cookieValue: string) {
    return cookieValue; // 특정 쿠키 값만 가져옴
  }
}
