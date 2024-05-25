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
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response as exRes } from 'express';
import { RefreshAuthGuard } from './refresh-auth.guard';
import * as util from 'util';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './public.decorator';
import { Request as exReq } from 'express';

@Controller('auth/')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Public()
  @UseGuards(LocalAuthGuard)
  // @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Res() res: exRes) {
    return this.authService.signin(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
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

  @Public()
  @Post('logout')
  async logout(@Req() req: exReq, @Res() res: exRes) {
    return this.authService.signout(req, res);
  }
}
