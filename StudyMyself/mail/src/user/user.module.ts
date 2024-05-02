import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [UserService, EmailService],
  controllers: [UserController],
})
export class UserModule {}
