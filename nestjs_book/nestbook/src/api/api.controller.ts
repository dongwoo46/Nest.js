import { Controller, Get, HostParam } from '@nestjs/common';

@Controller({ host: ':version.api.example.com' }) // 하위도메인 요청 처리 설정
export class ApiController {
  @Get() // 같은 루트 경로
  index(@HostParam('versioin') version: string): string {
    return `Hello,API ${version}`;
  }
}
