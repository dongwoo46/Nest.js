import { Module } from '@nestjs/common';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { utilities, WinstonModule } from 'nest-winston';

const dirname =
  'C:\\Users\\dw\\Desktop\\Nest.js\\StudyMyself\\all\\src\\logger\\logFile';

const dailyOptions = (level: string) => {
  return {
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.printf(
        (info) => `[${info.timestamp}] winston.${info.level}: ${info.message}`,
      ),
    ),
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: dirname + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30, //30일치 로그파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
  };
};

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6,
// };

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            // winston.format.simple(),
            utilities.format.nestLike('winston', {
              prettyPrint: true,
              colors: true,
            }),
            // winston.format.printf(
            //   (info) =>
            //     `[${info.timestamp}] [${info.level}] ${JSON.stringify(info)}`,
            // ),
          ),
        }),
        new winstonDaily({
          level: '6',
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf(
              (info) =>
                `[${info.timestamp}] winston.${info.level}: ${info.message}`,
            ),
          ),
          dirname: dirname,
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new winstonDaily(dailyOptions('warn')),
        // new winstonDaily(dailyOptions('info')),
        // new winstonDaily(dailyOptions('error')),
      ],
    }),
  ],
})
export class LoggerModule {}
