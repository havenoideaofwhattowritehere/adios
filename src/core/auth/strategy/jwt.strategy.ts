import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get<string>('auth.jwksUri'),
      }),

      jwtFromRequest: (req: any) => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        return token;
      },
      audience: configService.get<string>('auth.audience'),
      issuer: configService.get<string>('auth.issuer'),
      algorithms: ['RS256'],
    });
  }

  validate(payload: any): any {
    return {
      auth0UserId: payload.sub,
    };
  }
}
