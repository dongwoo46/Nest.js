import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class RenewLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    super.error('내가 에러를 처음부터 구성하는중~~');
  }

  customLog() {
    this.log('Please feed the cat!');
  }
}
