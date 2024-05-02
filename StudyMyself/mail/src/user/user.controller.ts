import { Controller, Get, Post } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async sendMail() {
    // await this.emailService.sendMember('qwa406@naver.com', 'token');
    await this.userService.example();
  }

  @Get('/signin')
  async signin() {
    return 'signin';
  }

  @Get('/signup')
  async signup() {
    return 'signup';
  }
}
