import { Socket } from 'socket.io';
import { ChatGuard } from './chat.guard';

export type SocketIOMiddleware2 = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware2 = (): SocketIOMiddleware2 => {
  return (client, next) => {
    try {
      ChatGuard.validateToken(client);
      next();
    } catch (error) {
      next(error);
    }
  };
};
