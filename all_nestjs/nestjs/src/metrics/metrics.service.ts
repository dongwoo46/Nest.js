import { Inject, Injectable } from '@nestjs/common';

import * as client from 'prom-client';

import { Counter, Gauge, Histogram, Summary } from 'prom-client';
@Injectable()
export class MetricsService {
  private readonly customCounter: client.Counter<string>;

  //PushGateway는 단기 실행 작업이나 직접적으로 Prometheus에 의해 스크레이프될 수 없는 환경에서 메트릭을 수집하기 위한 도구입니다. 메트릭을 임시로 저장하고, Prometheus 서버가 이를 주기적으로 스크레이프할 수 있도록 합니
  constructor(
    private readonly pushgateway: client.Pushgateway<any>,
    @Inject('feature_metric')
    private readonly featureCounter: Counter<string>,
    @Inject('memory_usage') private readonly gauge: Gauge<string>,
    @Inject('http_request_duration_seconds')
    private readonly histogram: Histogram<string>,
    @Inject('http_request_summary') private readonly summary: Summary<string>,
  ) {}

  async pushMetrics() {
    await this.pushgateway.pushAdd({ jobName: 'my_job' });
  }

  incrementFeatureCounter() {
    this.featureCounter.inc();
  }

  setMemoryUsage(value: number) {
    this.gauge.set(value);
  }

  observeRequestDuration(duration: number) {
    this.histogram.observe(duration);
  }

  observeRequestSummary(duration: number) {
    this.summary.observe(duration);
  }
}
