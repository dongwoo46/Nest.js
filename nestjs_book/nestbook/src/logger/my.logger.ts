//my.logger.ts
import { ConsoleLogger, LoggerService } from '@nestjs/common';
import { LogLevel } from 'typeorm';

// //커스텀로거1 - 단순히 로그만찍어줌
// export class MyLogger implements LoggerService {
//   log(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }

//   error(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }

//   warn(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }

//   debug?(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }

//   verbose?(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }
// }

//커스텀로거2 - 파일 만들어주고 디비저장하고 프로세스id, 로깅시간,로그레벨,콘텍스트이름등 함께 출력
export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error.apply(this, arguments);
    this.doSomething();
  }

  private doSomething() {
    // 여기에 로깅에 관련된 부가 로직 추가
    // ex. DB에 저장
  }
}
