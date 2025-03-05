import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { forwardRef } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { AuthService } from '../../src/core/auth/auth.service';
import { JwtStrategy } from '../../src/core/auth/strategy/jwt.strategy';
import { UserService } from '../../src/modules/user/user.service';
import { ClubService } from '../../src/modules/club/club.service';
import { ClubStaffService } from '../../src/modules/club-staff/club-staff.service';
import { AuthController } from '../../src/core/auth/auth.controller';
import { ClubModule } from '../../src/modules/club/club.module';
import { ClubStaffModule } from '../../src/modules/club-staff/club-staff.module';
import { UserModule } from '../../src/modules/user/user.module';
import { DatabaseModule } from '../../src/core/database/database.module';
import { ClubRepository } from '../../src/modules/club/club.repository';
import { LoggerModule } from '../../src/shared/logging/logger.module';

jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn().mockReturnValue({
    secretOrKeyProvider: jest.fn().mockResolvedValue('some-secret'),
  }),
}));

describe.skip('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        HttpModule,
        forwardRef(() => UserModule),
        forwardRef(() => ClubModule),
        ClubStaffModule,
        DatabaseModule,
        LoggerModule,
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        ConfigService,
        UserService,
        ClubService,
        ClubStaffService,
        {
          provide: 'SEQUELIZE',
          useValue: {
            transaction: jest.fn(() => ({
              commit: jest.fn(),
              rollback: jest.fn(),
            })),
          },
        },
        {
          provide: ClubRepository,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {
            translate: jest.fn((key: string) => key),
          },
        },
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AuthService', () => {
    const service = module.get<AuthService>(AuthService);
    expect(service).toBeDefined();
  });

  it('should have JwtStrategy', () => {
    const strategy = module.get<JwtStrategy>(JwtStrategy);
    expect(strategy).toBeDefined();
  });

  it('should have ConfigService', () => {
    const configService = module.get<ConfigService>(ConfigService);
    expect(configService).toBeDefined();
  });
});
