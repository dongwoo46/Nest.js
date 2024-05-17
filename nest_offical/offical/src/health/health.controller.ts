import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { DogHealthIndicator } from './dog-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    @InjectConnection('albumsConnection')
    private albumsConnection: Connection,
    @InjectConnection()
    private defaultConnection: Connection,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private dogHealthIndicator: DogHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  checkHttp() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  @Get()
  @HealthCheck()
  checkHttp2() {
    return this.health.check([
      () =>
        this.http.responseCheck(
          'my-external-service',
          'https://my-external-service.com',
          (res) => res.status === 204,
        ),
    ]);
  }

  @Get()
  @HealthCheck()
  checkDB() {
    [
      () =>
        this.db.pingCheck('albums-database', {
          connection: this.albumsConnection,
        }),
      () =>
        this.db.pingCheck('database', { connection: this.defaultConnection }),
    ];
  }

  @Get()
  @HealthCheck()
  checkDisk() {
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
    ]);
  }

  @Get()
  @HealthCheck()
  checkDisk2() {
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          threshold: 250 * 1024 * 1024 * 1024,
        }),
    ]);
  }

  @Get()
  @HealthCheck()
  checkMemory() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }

  @Get()
  @HealthCheck()
  checkMemory2() {
    return this.health.check([
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }

  @Get()
  @HealthCheck()
  customHealthCheck() {
    return this.health.check([() => this.dogHealthIndicator.isHealthy('dog')]);
  }
}
