import { Test, TestingModule } from '@nestjs/testing';

import { SessionInstanceController } from '../../src/modules/session-instance/session-instance.controller';
import { SessionInstanceModule } from '../../src/modules/session-instance/session-instance.module';
import { SessionInstanceService } from '../../src/modules/session-instance/session-instance.service';

describe('SessionInstanceModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [SessionInstanceModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('should have SessionInstance components', async () => {
    expect(module.get(SessionInstanceController)).toBeInstanceOf(
      SessionInstanceController,
    );
    expect(module.get(SessionInstanceService)).toBeInstanceOf(
      SessionInstanceService,
    );
  });
});
