import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { jwtConstants } from 'src/auth/constants';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(bearerToken) as any;
      return new Promise((resolve, reject) => {
        return this.usersService
          .findOneByUsername(decoded.username)
          .then((user) => {
            if (user) {
              resolve(user);
            } else {
              reject(false);
            }
          });
      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
