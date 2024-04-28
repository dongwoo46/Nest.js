import { Controller, Get, Res, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

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

  @Get('/cookieRequest')
  testCookieRequest(@Req() request: Request) {
    console.log(request.cookies); // or "request.cookies['cookieKey']"
    // or console.log(request.signedCookies);
  }

  @Get('/cookieResponse')
  testCookieResponse(@Res({ passthrough: true }) response: Response) {
    response.cookie('cookieName', 'cookieValue', {
      maxAge: 300000,
      // none, lax, strict 중 none은 쿠키가 항상 전송되도록 허용.
      sameSite: 'none', // HTTPS 프로토콜을 사용하고 secure 옵션이 설정된 경우에만 사용 가능
      secure: true, // 쿠키가 HTTPS 프로토콜을 사용하는 경우에만 전송되도록 제한
      httpOnly: true, // 쿠키에 접근할 수 있는 영역을 HTTP(S) 프로토콜로 제한하여,
      // 브라우저의 자바스크립트 코드로부터 쿠키에 접근할 수 없게 함
    });
    response.cookie('key', 'value');
    return response.cookie;
  }
}
