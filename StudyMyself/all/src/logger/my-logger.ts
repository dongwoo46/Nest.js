import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class MyLogger extends ConsoleLogger {
  log(message: any, ...optionalParams: any[]) {
    super.log(`🪵 ${message}`, ...optionalParams);
  }

  // 기본 구현의 특정동작을 재정의 하는 것 로거를 처음부터 사용하나 기본기능 재사용
  debug(message: any, ...optionalParams: any[]) {
    super.debug(`🐛 ${message}`, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    super.warn(`🚨 ${message}`, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(`💥 ${message}`, ...optionalParams);
  }

  // silly(message: any, ...optionalParams: any[]) {
  //   console.silly(`💥 ${message}`, ...optionalParams);
  // }
  // fatal(message: any, stack?: string, context?: string) {
  //   // add your tailored logic here
  //   super.error(...arguments);
  // }

  customLog() {
    this.log('please be my lady');
  }
}
