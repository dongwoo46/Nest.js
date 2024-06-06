import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class ChatGuard implements CanActivate {
  private readonly logger = new Logger(ChatGuard.name);
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: Socket = context.switchToWs().getClient();
    const { authorization } = client.handshake.headers;
    this.logger.log({ authorization }, 'i got the auth');
    const payload = ChatGuard.validateToken(client);
    if (payload) {
      return true;
    }
    return false;
  }

  static validateToken(client: Socket) {
    const { authorization } = client.handshake.headers;
    const token: string = authorization.split(' ')[1];
    const payload = verify(token, jwtConstants.secret);
    client['user'] = payload;
    return payload;
  }
}
