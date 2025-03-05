import { Test, TestingModule } from '@nestjs/testing';

import { ClubStaffController } from '../../src/modules/club-staff/club-staff.controller';
import { ClubStaffModule } from '../../src/modules/club-staff/club-staff.module';
import { ClubStaffService } from '../../src/modules/club-staff/club-staff.service';

describe('ClubStaffModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ClubStaffModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('should have ClubStaff components', async () => {
    expect(module.get(ClubStaffController)).toBeInstanceOf(ClubStaffController);
    expect(module.get(ClubStaffService)).toBeInstanceOf(ClubStaffService);
  });
});
