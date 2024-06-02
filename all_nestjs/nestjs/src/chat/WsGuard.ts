import { Injectable, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import { jwtConstants } from 'src/auth/constants';
import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class WsGuard implements CanActivate {
//   constructor(private usersService: UsersService) {}

//   canActivate(
//     context: any,
//   ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
//     const bearerToken =
//       context.args[0].handshake.headers.authorization.split(' ')[1];
//     try {
//       const decoded = jwt.verify(bearerToken, jwtConstants.secret) as any;
//       return new Promise((resolve, reject) => {
//         return this.usersService
//           .findOneByUsername(decoded.username)
//           .then((user) => {
//             if (user) {
//               resolve(user);
//             } else {
//               reject(false);
//             }
//           });
//       });
//     } catch (ex) {
//       console.log(ex);
//       return false;
//     }
//   }
// }
