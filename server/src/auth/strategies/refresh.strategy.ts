import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { Request } from 'express';
import { AuthService } from '../auth.service';

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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshJwtConfiguration.secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: AuthJwtPayload) {
    const refreshToken = req.get('authorization')?.replace('Bearer ', '').trim();
    const userId = payload.sub;

    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
