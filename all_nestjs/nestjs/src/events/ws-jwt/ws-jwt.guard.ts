import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: Socket = context.switchToWs().getClient();
    const { authorization } = client.handshake.headers;
    this.logger.log({ authorization }, 'i got the auth');
    WsJwtGuard.validateToken(client);

    return false;
  }

  static validateToken(client: Socket) {
    const { authorization } = client.handshake.headers;
    console.log(authorization);
    const token: string = authorization;
    const payload = verify(token, jwtConstants.secret);
    console.log(payload);
    return payload;
  }
}
