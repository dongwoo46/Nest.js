import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly mailerService: MailerService) {}

  public example(): void {
    const url = 'http://localhost:3000';
    this.mailerService
      .sendMail({
        to: 'qwa406@naver.com', // list of receivers
        from: 'qwa406@naver.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: `
        이메일 테스트입니다. <br/>
        <form action="${url}" method="POST">
         <button>확인</button>
        </form> 
      `, // HTML body content
      })
      .then(() => {})
      .catch(() => {});
  }
}
