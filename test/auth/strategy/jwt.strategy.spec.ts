import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/core/auth/auth.service';
import { JwtStrategy } from '../../../src/core/auth/strategy/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { jest } from '@jest/globals';

interface User {
  id: string;
  auth0UserId: string;
}

interface MockAuthService extends Partial<AuthService> {
  findOrCreateUser: jest.MockedFunction<
    (auth0UserId: string) => Promise<User | null>
  >;
}

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    mockAuthService = {
      findOrCreateUser: jest.fn(),
    } as Partial<MockAuthService> as MockAuthService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config = {
                'auth.jwksUri': 'https://example.com/.well-known/jwks.json',
                'auth.audience': 'test-audience',
                'auth.issuer': 'test-issuer',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });
});
