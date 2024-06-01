import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { RedisService } from './redis.service';

@Controller('/redis')
@Public()
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post()
  async setCacheKey(@Query('key') key: string, @Query('value') value: string) {
    await this.redisService.setCacheKey(key, value);
    return {
      success: true,
      status: 201,
      message: 'key cached  successfully',
    };
  }

  @Get('/get/:key')
  async getCacheKey(@Param('key') key: string) {
    const data = await this.redisService.getCacheKey(key);
    return {
      success: true,
      status: 200,
      data,
    };
  }

  @Delete('/:key')
  async deleteCacheKey(@Param('key') key: string) {
    await this.redisService.deleteCacheKey(key);
    return {
      success: true,
      status: 201,
      message: 'key deleted successfully',
    };
  }

  @Get('/reset')
  async resetCache() {
    await this.redisService.resetCache();
    return {
      success: true,
      status: 200,
      message: 'cache cleared successfully',
    };
  }

  @Get('/store')
  async cacheStore() {
    const store = await this.redisService.cacheStroe();
    return {
      success: true,
      status: 200,
      data: store,
    };
  }
}
