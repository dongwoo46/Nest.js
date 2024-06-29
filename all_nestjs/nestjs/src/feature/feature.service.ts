import { Inject, Injectable } from '@nestjs/common';

import { Counter, Gauge, Histogram, Summary } from 'prom-client';

@Injectable()
export class FeatureService {
  constructor(
    @Inject('feature_metric')
    private readonly featureCounter: Counter<string>,
    @Inject('memory_usage') private readonly gauge: Gauge<string>,
    @Inject('http_request_duration_seconds')
    private readonly histogram: Histogram<string>,
    @Inject('http_request_summary') private readonly summary: Summary<string>,
  ) {}

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
