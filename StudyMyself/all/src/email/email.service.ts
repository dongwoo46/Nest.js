import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodeMailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_AUTH_EMAIL,
        pass: process.env.EMAIL_AUTH_PASSWORD,
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = 'http://localhost:3000';

    const url = `${baseUrl}/users/email-verify-form?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
        이메일 테스트입니다. <br/>
        <form action="${url}" method="POST">
         <button>확인</button>
        </form> 
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendSignUpVerifyToken(emailAddress: string, signupVerifyToken: string) {
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
        이메일 테스트입니다. <br/>
        <p>"${signupVerifyToken}"</p>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
