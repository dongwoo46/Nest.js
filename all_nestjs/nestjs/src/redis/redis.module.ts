import * as redisStore from 'cache-manager-redis-store';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

//$ docker run --name redis -p 6379:6379 -d redis 도커로 레디스 실행
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 60 * 60 * 24, // seconds
      max: 100, // maximum number of items in cache
    }),
  ],
  providers: [RedisService],
  controllers: [RedisController],
  exports: [RedisService],
})
export class RedisModule {}
