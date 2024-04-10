import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);
    const signupVerifyToken = randomUUID();
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private checkUserExists(email: string) {
    return false;
  }

  private saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return false;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    //1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러처리
    //2. 바로 로그인 상태가 되도록 JWT발급

    throw new Error('Method not implemented');
  }
  async login(email: string, password: string): Promise<string> {
    // 1.email,password를 가진 유저가 존재하는지 디비에서 확인하고 없으면 에러처리
    // 2. jwt 발급

    throw new Error('에러실행');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    // 1. userId를 가진 유저가 존재하는지 디비확인하고 없으면 에러처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답
    throw new Error('에러 ');
  }
}
