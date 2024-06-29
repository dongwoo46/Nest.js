import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { MetricsModule } from '../metrics/metrics.module';
import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
  makeSummaryProvider,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [MetricsModule],
  providers: [
    FeatureService,
    makeCounterProvider({
      name: 'feature_metric',
      help: 'This is a feature specific metric',
    }),
    makeGaugeProvider({
      name: 'memory_usage',
      help: 'Current memory usage',
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      buckets: [0.1, 0.5, 1, 2.5, 5, 10],
    }),
    makeSummaryProvider({
      name: 'http_request_summary',
      help: 'Summary of HTTP request durations',
      percentiles: [0.5, 0.9, 0.99],
    }),
  ],
})
export class FeatureModule {}
