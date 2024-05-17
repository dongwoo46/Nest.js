import { Injectable, Logger } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateToken(user: any) {
    const payload = { email: user.email, userId: user.userId };

    // 액세스 토큰 및 리프레시 토큰 생성
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersService.saveRefreshToken(user.userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async makeAccessTokenUsingRereshToken(
    refreshToken: string,
  ): Promise<string | null> {
    const user = await this.usersService.findOneByRefreshToken(refreshToken);
    if (!user) {
      return null; // 사용자가 존재하지 않으면 null 반환
    }

    // 새로운 액세스 토큰 발급
    const accessToken = this.jwtService.sign({ userId: user.userId });
    return accessToken;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
