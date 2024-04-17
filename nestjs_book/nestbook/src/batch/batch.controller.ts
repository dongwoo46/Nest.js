import { Controller, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batches')
export class BatchController {
  constructor(private scheduler: SchedulerRegistry) {} // 컨트롤러에 스케쥴러 주입

  @Post('/start-sample')
  start() {
    const job = this.scheduler.getCronJob('cronSample'); // SchedulerResgistry에 등록된 크론잡 가져옴 등록할 때 선언한 이름 사용

    job.start();
    console.log(`start!!`, job.lastDate());
  }

  @Post('/stop-sample')
  stop() {
    const job = this.scheduler.getCronJob('cronSample');

    job.stop();
    console.log('stopped!', job.lastDate());
  }
}
