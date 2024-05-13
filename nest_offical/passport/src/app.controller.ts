//app.controller.ts
import { Controller, Request, Post, UseGuards, Get, Req } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RefreshAuthGuard } from './auth/refresh-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // // @UseGuards(AuthGuard('local'))
  // @Post('auth/login')
  // async login(@Request() req) {
  //   return this.authService.generateToken(req.user);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('auth/profile')
  // jwtGetProfile(@Request() req) {
  //   return req.user;
  // }

  // @Post('/refresh')
  // @UseGuards(RefreshAuthGuard)
  // async refreshToken(@Request() req) {
  //   const accessToken = await this.authService.createAccessToken(req.user);
  //   const user = new UserBuilder()
  //     .withNo(req.user.no)
  //     .withId(req.user.id);
  //   return { accessToken, user };
  // }
}
