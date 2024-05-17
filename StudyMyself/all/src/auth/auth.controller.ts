import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Res,
  Response,
  Req,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response as exRes } from 'express';
import * as util from 'util';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './public.decorator';
import { Request as exReq } from 'express';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @UseGuards(LocalAuthGuard)
  // @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Res() res: exRes) {
    const { accessToken, refreshToken } = await this.authService.generateToken(
      req.user,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    //응답을 express 타입으로 불러왔기 때문에, 기존에 nest에서 하던대로 return으로 반환하는 것이 아닌, res.send로 반환
    return res.send({ accessToken });
  }

  jwtGetProfile(@Request() req) {
    return req.user;
  }

  @Post('refreshToken')
  @UseGuards(RefreshAuthGuard)
  @Public()
  async refreshToken(@Request() req) {
    const accessToken = await this.authService.makeAccessTokenUsingRereshToken(
      req.user,
    );

    return { accessToken };
  }
}
