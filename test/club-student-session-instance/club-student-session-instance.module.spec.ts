import { Test, TestingModule } from '@nestjs/testing';

import { ClubStudentSessionInstanceController } from '../../src/modules/club-student-session-instance/club-student-session-instance.controller';
import { ClubStudentSessionInstanceModule } from '../../src/modules/club-student-session-instance/club-student-session-instance.module';
import { ClubStudentSessionInstanceService } from '../../src/modules/club-student-session-instance/club-student-session-instance.service';

describe('ClubStudentSessionInstanceModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ClubStudentSessionInstanceModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('should have ClubStudentSessionInstance components', async () => {
    expect(module.get(ClubStudentSessionInstanceController)).toBeInstanceOf(
      ClubStudentSessionInstanceController,
    );
    expect(module.get(ClubStudentSessionInstanceService)).toBeInstanceOf(
      ClubStudentSessionInstanceService,
    );
  });
});
