import { Module } from '@nestjs/common';
import { File3Service } from './file3.service';
import { File3Controller } from './file3.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { TokenStrategy } from './token.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [File3Controller],
  providers: [File3Service, TokenStrategy],
})
export class File3Module {}
