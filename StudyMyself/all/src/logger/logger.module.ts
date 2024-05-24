import { Module } from '@nestjs/common';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { utilities, WinstonModule } from 'nest-winston';

const dirname =
  'C:\\Users\\dw\\Desktop\\Nest.js\\StudyMyself\\all\\src\\logger\\logFile';

// dailyOptions 함수 정의
// winston 사용시 데이터의 출력시 json을 이용하는지 단순 message로 보내는지 하나로 통일 시켜야 파일이 저장된다.(보내는 객체가 json? or 단수 메시지냐)
const dailyOptions = (level: string) => ({
  level,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    // winston.format.printf(
    //   (info) => `[${info.timestamp}] winston.${info.level}: ${info.message}`,
    // ),
    winston.format.json(),
  ),
  dirname: `${dirname}/${level}`,
  filename: `%DATE%.${level}.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

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
            winston.format.printf(
              (info) =>
                `[${info.timestamp}] [${info.level}] ${JSON.stringify(info)}`,
            ),
            // winston.format.printf(
            //   (info) => `[${info.timestamp}] [${info.level}] ${info.message}`,
            // ),
          ),
        }),
        new winstonDaily({
          level: 'silly',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            // winston.format.printf(
            //   (info) =>
            //     `[${info.timestamp}] winston.${info.level}: ${info.message}`,
            // ),
            winston.format.printf(
              (info) =>
                `[${info.timestamp}] [${info.level}] ${JSON.stringify(info)}`,
            ),
          ),
          dirname: dirname,
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        // new winstonDaily(dailyOptions('warn')),
        // new winstonDaily(dailyOptions('info')),
        // new winstonDaily(dailyOptions('error')),
      ],
    }),
  ],
})
export class LoggerModule {}
