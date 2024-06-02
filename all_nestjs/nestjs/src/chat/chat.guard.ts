import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token);
      client['user'] = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
