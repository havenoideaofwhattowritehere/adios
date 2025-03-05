import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../../modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClubModule } from '../../modules/club/club.module';
import { ClubStaffModule } from '../../modules/club-staff/club-staff.module';
import { ClubStaffService } from '../../modules/club-staff/club-staff.service';
import { DatabaseModule } from '../database/database.module';
import { CurrentClubMiddleware } from '../../shared/middlewares/current-club.middleware';
import { LoggerModule } from '../../shared/logging/logger.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
    forwardRef(() => ClubModule),
    ClubStaffModule,
    HttpModule,
    DatabaseModule,
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, ConfigService, AuthService, ClubStaffService],
  exports: [PassportModule, AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentClubMiddleware).forRoutes('*');
  }
}
