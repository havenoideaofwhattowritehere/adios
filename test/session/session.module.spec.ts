import { Test, TestingModule } from '@nestjs/testing';

import { SessionController } from '../../src/modules/session/session.controller';
import { SessionModule } from '../../src/modules/session/session.module';
import { SessionService } from '../../src/modules/session/session.service';

describe.skip('SessionModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [SessionModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('should have Session components', async () => {
    expect(module.get(SessionController)).toBeInstanceOf(SessionController);
    expect(module.get(SessionService)).toBeInstanceOf(SessionService);
  });
});
