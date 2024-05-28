import { Injectable } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';

@Injectable()
export class SseService {
  getSse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => {
        const event: MessageEvent = new MessageEvent('message', {
          data: { hello: 'world' },
        });
        return event;
      }),
    );
  }
}
