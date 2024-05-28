import { Controller, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { Public } from 'src/auth/public.decorator';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Public()
  @Sse('/events')
  sendEvents(): Observable<MessageEvent> {
    return this.sseService.getSse();
  }
}
