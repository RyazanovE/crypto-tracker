import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { Request } from 'express';
import { AuthService } from '../auth.service';

const refreshTokenExtractor = (req: Request): string | null => {
  const refreshToken = req.headers.cookie
    ?.split("; ")
    .find(row => row.startsWith("refresh_token="))
    ?.split("=")[1];

  return refreshToken || null;
};

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshJwtConfig.KEY) private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService
  ) {
    if (!refreshJwtConfiguration.secret) {
      throw new Error('JWT secret is not defined');
    }

    super({ 
      jwtFromRequest: ExtractJwt.fromExtractors([refreshTokenExtractor]),
      secretOrKey: refreshJwtConfiguration.secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: AuthJwtPayload) {
    const refreshToken = refreshTokenExtractor(req)!;
    const userId = payload.sub;

    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
