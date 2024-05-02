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
        user: 'siwol406@gmail.com',
        pass: '',
      },
    });
  }

  async sendMember(emailAddress: string, token: string) {
    const baseUrl = 'http://localhost:3000';

    const url = `${baseUrl}/users`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '메일 인증',
      html: `
        이메일 테스트입니다. <br/>
        <form action="${url}" method="POST">
         <button>확인</button>
        </form> 
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
