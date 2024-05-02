import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './articles/entities/article.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import configEmail from './config/email';
import * as path from 'path';

@Module({
  imports: [
    ArticlesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'winston',
      entities: [Article],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configEmail],
    }),
    MailerModule.forRootAsync({
      useFactory: () => {
        return {
          // transport: {
          //   host: 'smtp.gmail.com',
          //   port: 587,
          //   auth: {
          //     user: process.env.EMAIL_AUTH_EMAIL,
          //     pass: process.env.EMAIL_AUTH_PASSWORD,
          //   },
          // },
          // defaults: {
          //   from: `'siwol' <siwol>`, //보낸사람
          // },
          transport: {
            host: 'smtp.naver.com',
            port: 587,
            auth: {
              user: process.env.EMAIL_NAVER,
              pass: process.env.EMAIL_NAVER_PASSWORD,
            },
          },
          defaults: {
            from: `'siwol' <siwol>`, //보낸사람
          },
        };
      },
    }),
    UserModule,

    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
