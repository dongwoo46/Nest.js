import { Module } from '@nestjs/common';
import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
  makeSummaryProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
      // pushgateway: {
      //   url: 'http://127.0.0.1:9091',
      // },
    }),
  ],
  providers: [
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
      buckets: [0.1, 0.5, 1, 2.5, 5, 10], // example buckets
    }),
    makeSummaryProvider({
      name: 'http_request_summary',
      help: 'Summary of HTTP request durations',
      percentiles: [0.5, 0.9, 0.99], // example percentiles
    }),
  ],
  exports: [
    PrometheusModule,
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
      buckets: [0.1, 0.5, 1, 2.5, 5, 10], // example buckets
    }),
    makeSummaryProvider({
      name: 'http_request_summary',
      help: 'Summary of HTTP request durations',
      percentiles: [0.5, 0.9, 0.99], // example percentiles
    }),
  ],
})
export class MetricsModule {}
