import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { extname } from 'path';
import * as fs from 'fs';
// 오늘날짜 포맷팅 쉽게 할려고 가볍게 쓸 수 있는것 하나 설치해봄
// npm i light-date
// import { format } from 'light-date';
import { format } from 'date-fns'; // 날짜 형식 라이브러리

@Module({
  imports: [
    // ConfigService 를 inject 하기 위해
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        storage: diskStorage({
          destination: function (req, file, cb) {
            // 파일저장위치 + 년월 에다 업로드 파일을 저장한다.
            // 요 부분을 원하는 데로 바꾸면 된다.
            const dest = `${config.get('ATTACH_SAVE_PATH')}/${format(new Date(), 'yyyyMMDD')}/`;

            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }

            cb(null, dest);
          },
          filename: (req, file, cb) => {
            // 업로드 후 저장되는 파일명을 랜덤하게 업로드 한다.(동일한 파일명을 업로드 됐을경우 오류방지)
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FileController],
})
export class FileModule {}
