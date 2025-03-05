import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../src/modules/user/user.service';
import { ClubStudentModule } from '../../src/modules/club-student/club-student.module';
import { AuthService } from '../../src/core/auth/auth.service';
import { ClubStudentRepository } from '../../src/modules/club-student/club-student.repository';
import { ClubStudentService } from '../../src/modules/club-student/club-student.service';

describe('ClubStudentModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const mockUserService = {};
    const mockAuthService = {};
    const mockI18nService = {};
    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'auth.jwksUri') {
          return 'https://example.com/.well-known/jwks.json';
        }
        return null;
      }),
    };
    const mockClubStudentService = {};
    const mockClubStudentRepository = {};

    module = await Test.createTestingModule({
      imports: [ClubStudentModule],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(I18nService)
      .useValue(mockI18nService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(ClubStudentService)
      .useValue(mockClubStudentService)
      .overrideProvider(ClubStudentRepository)
      .useValue(mockClubStudentRepository)
      .compile();
  });

  it('повинен бути визначений', () => {
    expect(module).toBeDefined();
    const clubStudentModule = module.get<ClubStudentModule>(ClubStudentModule);
    expect(clubStudentModule).toBeInstanceOf(ClubStudentModule);
  });
});
