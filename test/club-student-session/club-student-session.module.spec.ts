import { Test, TestingModule } from '@nestjs/testing';

import { ClubStudentSessionController } from '../../src/modules/club-student-session/club-student-session.controller';
import { ClubStudentSessionModule } from '../../src/modules/club-student-session/club-student-session.module';
import { ClubStudentSessionService } from '../../src/modules/club-student-session/club-student-session.service';

describe('ClubStudentSessionModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ClubStudentSessionModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('should have ClubStudentSession components', async () => {
    expect(module.get(ClubStudentSessionController)).toBeInstanceOf(
      ClubStudentSessionController,
    );
    expect(module.get(ClubStudentSessionService)).toBeInstanceOf(
      ClubStudentSessionService,
    );
  });
});
