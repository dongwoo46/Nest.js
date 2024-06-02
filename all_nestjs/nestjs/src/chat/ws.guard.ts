import { Injectable, CanActivate } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    if (context.getType() !== 'ws') {
      return true;
    }
    const client: Socket = context.switchToWs().getClient();
    const { authorization } = client.handshake.headers;
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    const token = authorization.split(' ')[1];
    console.log('wsguard');
    console.log(authorization);
    console.log(bearerToken);
    console.log(token);
    const verification = WsGuard.validateWsToken(bearerToken);
    const verification2 = WsGuard.validateWsToken(token);
    console.log(verification);
    console.log(verification2);
    return false;
    // try {
    //   const decoded = verify(bearerToken, jwtConstants.secret) as any;
    //   return new Promise((resolve, reject) => {
    //     return this.usersService.findOneById(decoded.userId).then((user) => {
    //       if (user) {
    //         resolve(user);
    //       } else {
    //         reject(false);
    //       }
    //     });
    //   });
    // } catch (ex) {
    //   console.log(ex);
    //   return false;
    // }
  }
  static validateWsToken(bearerToken) {
    try {
      const decoded = verify(bearerToken, jwtConstants.secret) as any;
      return decoded;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
