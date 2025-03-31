import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2'
import { UserService } from 'src/user/user.service';
import { CurrentUser } from './types/current-user';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, 
    private jwtService: JwtService, 
    @Inject(refreshJwtConfig.KEY) private refreshTokenConfiguration: ConfigType<typeof refreshJwtConfig>
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new UnauthorizedException('Invalid password');

    return {id: user.id};
  }

  async login(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return ({
      id: userId,
      accessToken,
      refreshToken
    })
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/auth/refresh',
      sameSite: 'strict',
    });
  }

  clearCookies(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfiguration)
    ])
    return {
      accessToken,
      refreshToken
    }
  }

  async validateRefreshToken(userId: number, refreshToken?: string) {
    const user = await this.userService.findOne(userId, true);

    if (!user?.hashedRefreshToken || !refreshToken) {
      throw new UnauthorizedException('User Refresh Token not found');
    }
    const refreshTokenMatches = await argon2.verify(user.hashedRefreshToken, refreshToken);

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { id: userId };
  }

  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return ({
      id: userId,
      accessToken,
      refreshToken
    })
  }

  async signOut(userId: number) {
    return await this.userService.updateHashedRefreshToken(userId, undefined);
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const currentUser: CurrentUser = { id: user.id, role: user.role };

    return currentUser;
  }
}
